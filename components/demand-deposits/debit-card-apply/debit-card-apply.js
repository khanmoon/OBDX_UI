define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/debit-card-apply",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojswitch",
    "ojs/ojdatetimepicker"
], function (ko, $, ApplyCardModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, selectedReasonArray;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        $("#statusSection").addClass("blank");
        self.reasonEnumLoaded = ko.observable(false);
        self.enableReview = ko.observable(false);
        self.loadConfirm = ko.observable(false);
        self.validationTracker = ko.observable();
        self.serviceId = ko.observable();
        self.reasonEnumList = ko.observableArray();
        rootParams.dashboard.headerName(resourceBundle.compName.newDebitCard);
        self.common = resourceBundle.common;
        self.accountInputDetails = ko.observable();
        self.accountNumber = ko.observable();
        self.srNo = ko.observable();
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.nls.review.reviewHeading;
        self.reviewTransactionName.reviewHeader = self.nls.common.reviewHeading;
        var getNewKoModel = function () {
            var KoModel = ApplyCardModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        var getNewAddressKoModel = function () {
            var KoModel = ApplyCardModel.getNewModelAddress();
            return ko.mapping.fromJS(KoModel);
        };
        if (self.params.id) {
            self.accountNumber(self.params.id.value);
        }
        self.applyCardModel = getNewKoModel();
        self.addressDetails = getNewAddressKoModel().addressDetails;
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("address");
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        ApplyCardModel.getReasons().done(function (data) {
            self.reasonEnumList(data.enumRepresentations[0].data);
            self.reasonEnumLoaded(true);
        });
        self.review = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            selectedReasonArray = self.applyCardModel.reason().split("-");
            self.applyCardModel.reason(selectedReasonArray[1]);
            self.enableReview(true);
            self.loadConfirm(false);
        };
        self.submitDetails = function () {
            self.applyCardModel.name(self.applyCardModel.name());
            self.applyCardModel.address.city(self.addressDetails.postalAddress.city);
            self.applyCardModel.address.state(self.addressDetails.state);
            self.applyCardModel.address.country(self.addressDetails.postalAddress.country);
            self.applyCardModel.address.zipCode(self.addressDetails.zipCode);
            self.applyCardModel.address.line1(self.addressDetails.postalAddress.line1);
            self.applyCardModel.address.line2(self.addressDetails.postalAddress.line2);
            self.applyCardModel.address.line3(self.addressDetails.postalAddress.line3);
            self.applyCardModel.address.line4(self.addressDetails.postalAddress.line4);
            self.applyCardModel.reason(selectedReasonArray[0]);
            if (self.addressDetails.modeofDelivery() === "ACC") {
                self.applyCardModel.deliveryOption("COR");
            } else {
                self.applyCardModel.deliveryOption = self.addressDetails.modeofDelivery();
            }
            ApplyCardModel.submitCardDetails(self.accountNumber(), ko.mapping.toJSON(self.applyCardModel)).done(function (data, status, jqXhr) {
                if (data.serviceId) {
                    self.srNo(data.serviceId);
                    self.loadConfirm(true);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXhr,
                        sr: true,
                        transactionName: self.nls.apply.transactionName,
                        template: "confirm-screen/casa-template",
                        serviceNo: data.serviceId,
                        srNo:self.srNo(),
                        confirmScreenExtensions: {
                          isSet: true,
                          taskCode: "CH_N_ADC"
                        },
                        flagApplyPin:true
                    }, self);
                    self.enableReview(false);
                }
            });
        };
        self.cancel = function () {
            self.applyCardModel.reason(selectedReasonArray[0] + "-" + selectedReasonArray[1]);
            self.enableReview(false);
        };
        self.redirect = function () {
            window.location.href = "demand-deposits.html";
        };
    };
});
