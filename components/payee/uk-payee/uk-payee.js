define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/domestic-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function(oj, ko, domesticPayeeModel, $, BaseLogger, ResourceBundle, commonPayee, Constants) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel.previousState ? Params.rootModel.previousState.retainedData : Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.domestic = Params.model;
        self.validationTracker = Params.validator;
        self.payments = commonPayee.payments;
        self.payments.payee.domestic = ResourceBundle.payments.payee.domestic;
        self.payeeDetails = ko.observable(self.domestic);
        self.domesticPayeeType = ko.observable("UK");
        Params.baseModel.registerElement("bank-look-up");
        self.currentPaymentType = ko.observable();
        self.additionalBankDetails = ko.observable(null);
        self.clearingCodeType = ko.observable();
        self.refreshLookup(false);
        self.groupValid = ko.observable();
        self.paymentTypes = ko.observableArray();
        self.isPaymentTypesLoaded = ko.observable(false);
        self.paymentTypesMap = {};
        domesticPayeeModel.init("UK");
        domesticPayeeModel.getPaymentTypes().done(function(data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.paymentTypes.push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });
                self.paymentTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            if (!self.paymentType()) {
                self.paymentType(data.enumRepresentations[0].data[0].code);
                self.paymentTypeChanged({
                    detail: {
                        value: data.enumRepresentations[0].data[0].code
                    }
                });
            }
            self.isPaymentTypesLoaded(true);
            self.stageOne(true);
            self.stageTwo(false);
        });
        self.paymentTypeChanged = function(event) {
            self.additionalBankDetails(null);
            self.refreshLookup(false);
            if (event.detail.value === "URG") {
                self.clearingCodeType("SWI");
                self.network("SWIFT");
            } else if (event.detail.value === "NOU") {
                self.clearingCodeType("NAC");
                self.network("SORT");
            } else if (event.detail.value === "FAS") {
                self.network("SORT");
                self.clearingCodeType("NAC");
            }
            self.refreshLookup(true);
        };
        self.validateCode = [{
            "validate": function(value) {
                if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.domestic.invalidError));
                }
            }
        }];
        self.verifyCode = function() {
            var tracker = document.getElementById("verify-swiftCode-tracker"),
                sortTracker = document.getElementById("verify-sortcode-tracker");
            if ((tracker !== null && tracker.valid === "valid") || (sortTracker !== null && sortTracker.valid === "valid")) {
                if (self.network() === "SWIFT")
                    domesticPayeeModel.getBankDetails(self.bankDetailsCode()).done(function(data) {
                        self.additionalBankDetails(data);
                    });
                else if (self.network() === "SORT")
                    domesticPayeeModel.getBankDetailsNCC(self.bankDetailsCode()).done(function(data) {
                        self.additionalBankDetails(data);
                    });
            }
        };
        self.resetCode = function() {
            self.bankDetailsCode(null);
            self.additionalBankDetails(null);
        };
        self.openLookup = function() {
            $("#menuButtonDialog").trigger("openModal");
        };
    };
});