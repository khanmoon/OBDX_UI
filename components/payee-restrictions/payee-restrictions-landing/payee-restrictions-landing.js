define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/payee-restrictions-landing",
    "promise",
    "ojs/ojinputnumber",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function (oj, ko, $, PayeeCountLimitModel, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this, newLimit, retainedLimit, getpayload = function () {
                var KoModel = ko.mapping.fromJS(PayeeCountLimitModel.getNewModel());
                return KoModel.updatePayload;
            }, getUpdateElement = function () {
                var KoModel = ko.mapping.fromJS(PayeeCountLimitModel.getNewModel());
                return KoModel.updateElement;
            };
        ko.utils.extend(self, Params.rootModel);
        self.searchResultLoaded = ko.observable(false);
        self.resource = ResourceBundle.resource;
        self.searchResult = ko.observable();
        self.validationTracker = ko.observable();
        self.isEdit = ko.observable(false);
        self.isReview = ko.observable(false);
        self.isInitite = ko.observable(true);
        self.searchResultMap = {};
        Params.dashboard.headerName(self.resource.payeeCount.title);
        Params.baseModel.registerElement([
            "confirm-screen",
            "modal-window",
            "action-header"
        ]);
        self.payeeLimitStatus = [
            {
                id: "Y",
                label: self.resource.common.yes
            },
            {
                id: "N",
                label: self.resource.common.no
            }
        ];
        PayeeCountLimitModel.listAllLimits().done(function (data) {
            self.searchResult(data.payeeCountLimitList);
            for (var i = 0; i < self.searchResult().length; i++) {
                var payeeTypeLimit;
                for (var j = 0; j < self.searchResult()[i].accountPayee.length; j++) {
                    self.searchResult()[i].accountPayee[j].payeeCountLimitStatus = ko.observable(self.searchResult()[i].accountPayee[j].payeeCountLimitStatus?"Y":"N");
                    payeeTypeLimit = self.searchResult()[i].accountPayee[j];
                    self.searchResultMap[payeeTypeLimit.payeeType + "-" + payeeTypeLimit.effectiveDate] = {
                        payeesPerDay: payeeTypeLimit.payeesPerDay,
                        payeeCountLimitStatus: payeeTypeLimit.payeeCountLimitStatus()
                    };
                }
                for (var k = 0; k < self.searchResult()[i].draftpayee.length; k++) {
                    self.searchResult()[i].draftpayee[k].payeeCountLimitStatus = ko.observable(self.searchResult()[i].draftpayee[k].payeeCountLimitStatus?"Y":"N");
                    payeeTypeLimit = self.searchResult()[i].draftpayee[k];
                    self.searchResultMap[payeeTypeLimit.payeeType + "-" + payeeTypeLimit.effectiveDate] = {
                        payeesPerDay: payeeTypeLimit.payeesPerDay,
                        payeeCountLimitStatus: payeeTypeLimit.payeeCountLimitStatus()
                    };
                }
            }
            self.searchResultLoaded(true);
        });
        self.showWarning = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            $("#effectivedate").trigger("openModal");
        };
        self.hideWarning = function () {
            $("#effectivedate").hide();
        };
        self.switchEditMode = function () {
            self.searchResultLoaded(false);
            self.isInitite(false);
            if (self.isReview())
                self.isReview(false);
            else
                self.isEdit(!self.isEdit());
            ko.tasks.runEarly();
            self.searchResultLoaded(true);
        };
        self.switchEditModenRetainValues = function () {
            self.isInitite(false);
            for (var i = 0; i < self.searchResult().length; i++) {
                for (var j = 0; j < self.searchResult()[i].accountPayee.length; j++) {
                    newLimit = self.searchResult()[i].accountPayee[j];
                    retainedLimit = self.searchResultMap[newLimit.payeeType + "-" + newLimit.effectiveDate];
                    if (retainedLimit.payeesPerDay !== newLimit.payeesPerDay || retainedLimit.payeeCountLimitStatus !== newLimit.payeeCountLimitStatus()) {
                        self.searchResult()[i].accountPayee[j].payeesPerDay = retainedLimit.payeesPerDay;
                        self.searchResult()[i].accountPayee[j].payeeCountLimitStatus(retainedLimit.payeeCountLimitStatus);
                    }
                }
                for (var k = 0; k < self.searchResult()[i].draftpayee.length; k++) {
                    newLimit = self.searchResult()[i].draftpayee[k];
                    retainedLimit = self.searchResultMap[newLimit.payeeType + "-" + newLimit.effectiveDate];
                    if (retainedLimit.payeesPerDay !== newLimit.payeesPerDay || retainedLimit.payeeCountLimitStatus !== newLimit.payeeCountLimitStatus()) {
                        self.searchResult()[i].draftpayee[k].payeesPerDay = retainedLimit.payeesPerDay;
                        self.searchResult()[i].draftpayee[k].payeeCountLimitStatus(retainedLimit.payeeCountLimitStatus);
                    }
                }
            }
            self.switchEditMode();
        };
        self.goToReviewScreen = function () {
            self.isReview(true);
            self.hideWarning();
        };
        self.confirmEdit = function () {
            var payload = getpayload();
            for (var i = 0; i < self.searchResult().length; i++) {
                var updateElement;
                for (var j = 0; j < self.searchResult()[i].accountPayee.length; j++) {
                    newLimit = self.searchResult()[i].accountPayee[j];
                    retainedLimit = self.searchResultMap[newLimit.payeeType + "-" + newLimit.effectiveDate];
                    if (retainedLimit.payeesPerDay !== newLimit.payeesPerDay || retainedLimit.payeeCountLimitStatus !== newLimit.payeeCountLimitStatus()) {
                        updateElement = getUpdateElement();
                        updateElement.payeeType(newLimit.payeeType);
                        updateElement.payeesPerDay(newLimit.payeesPerDay);
                        updateElement.payeeCountLimitStatus(newLimit.payeeCountLimitStatus() === "Y");
                        payload.payeeCountLimitList().push(updateElement);
                    }
                }
                for (var k = 0; k < self.searchResult()[i].draftpayee.length; k++) {
                    newLimit = self.searchResult()[i].draftpayee[k];
                    retainedLimit = self.searchResultMap[newLimit.payeeType + "-" + newLimit.effectiveDate];
                    if (retainedLimit.payeesPerDay !== newLimit.payeesPerDay || retainedLimit.payeeCountLimitStatus !== newLimit.payeeCountLimitStatus()) {
                        updateElement = getUpdateElement();
                        updateElement.payeeType(newLimit.payeeType);
                        updateElement.payeesPerDay(newLimit.payeesPerDay);
                        updateElement.payeeCountLimitStatus(newLimit.payeeCountLimitStatus() === "Y");
                        payload.payeeCountLimitList().push(updateElement);
                    }
                }
            }
            if (payload.payeeCountLimitList().length > 0) {
                payload = ko.toJSON(payload);
                PayeeCountLimitModel.addPayeeLimits(payload).done(function (data, status, jqXHR) {
                    self.searchResultLoaded(false);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.resource.payeeCount.title,
                        template: "payee/confirm-screen-templates/payee-restrictions-landing"
                    }, self);
                });
            }
        };
    };
});