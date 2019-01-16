define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/cancel-card",
    "ojs/ojknockout",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (oj, ko, $, CancellationModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.params;
        Params.dashboard.headerName(self.resource.cancelCard.cardHeading);
        self.isDataLoaded = ko.observable(false);
        self.selectedReason = ko.observable();
        self.validationTracker = ko.observable();
        self.reasonsArray = ko.observableArray();
        self.remainingCommentChars = ko.observable(400);
        self.comment = ko.observable();
        self.initiateCancel = ko.observable(true);
        self.verifyCancel = ko.observable(false);
        self.confirmCancel = ko.observable(false);
        self.creditCardDisplayId = ko.observable();
        self.creditCardId = ko.observable();
        self.moduleURL = ko.observable();
        self.actionType = ko.observable("Cancel");
        self.srNo = ko.observable();
        Params.baseModel.registerElement("comment-box");
        Params.baseModel.registerComponent("review-cancellation", "creditcard");
        var confirmData;
        if (self.cardObject.creditCard) {
            self.creditCardId(self.cardObject.creditCard.value);
            self.creditCardDisplayId(self.cardObject.creditCard.displayValue);
        }
        if (self.params.jsonData) {
            self.moduleURL(self.params.jsonData.moduleURL);
        }
        self.commentLengthTrack = function () {
            self.remainingCommentChars(40 - document.getElementById("commentbox").value.length);
        };
        self.cancelVerify = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            confirmData = {
                "statusType": "CLD",
                "statusUpdateReason": { "cancelReason": self.selectedReason() }
            };
            self.initiateCancel(false);
            self.verifyCancel(true);
            self.confirmCancel(false);
            var context = {};
            context.headerName = Params.dashboard.headerName();
            self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.cardObject;
            context.creditCardId = self.creditCardId();
            context.creditCardDisplayId = self.creditCardDisplayId();
            context.verifyCancel = self.verifyCancel();
            context.confirmData = confirmData;
            Params.dashboard.loadComponent("review-cancellation", context, self);
        };
        if (!self.verifyCancel()) {
            CancellationModel.fetchCancelReasons().done(function (data) {
                for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.reasonsArray().push({
                        code: data.enumRepresentations[0].data[i].code,
                        description: self.resource.cancelCard[data.enumRepresentations[0].data[i].code]
                    });
                }
                self.isDataLoaded(true);
            });
        }
        self.cancelConfirm = function () {
            CancellationModel.cancelCard(ko.toJSON(confirmData), self.creditCardId()).done(function (data, status, jqXhr) {
                if (typeof data.serviceID !== "undefined") {
                    self.srNo(data.serviceID);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        sr: true,
                        transactionName: self.resource.cancelCard.cardHeading,
                        srNo:self.srNo(),
                        serviceNo: data.serviceID,
                        confirmScreenExtensions: {
                          isSet: true,
                          template: "confirm-screen/cc-template",
                          taskCode: "CC_N_BCCC"
                        }
                    }, self);
                } else {
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        transactionName: self.resource.cancelCard.cardHeading,
                        confirmScreenExtensions: {
                          isSet: true,
                          template: "confirm-screen/cc-template",
                          taskCode: "CC_N_BCCC"
                        }
                    }, self);
                }
                self.initiateCancel(false);
                self.verifyCancel(false);
                self.confirmCancel(true);
            });
        };
    };
});
