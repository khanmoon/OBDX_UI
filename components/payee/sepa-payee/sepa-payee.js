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
], function (oj, ko, domesticPayeeModel, $, BaseLogger, ResourceBundle, commonPayee, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.domestic = Params.model;
        self.validationTracker = Params.validator;
        self.payments = commonPayee.payments;
        self.payments.payee.domestic = ResourceBundle.payments.payee.domestic;
        self.payeeDetails = ko.observable(self.domestic);
        self.domesticPayeeType = ko.observable("SEPA");
        self.currentPaymentType = ko.observable();
        self.paymentTypes = ko.observableArray();
        self.isPaymentTypesLoaded = ko.observable(false);
        self.paymentTypesMap = {};
        self.groupValid = ko.observable();
        self.additionalBankDetails = ko.observable(null);
        self.clearingCodeType = ko.observable("SWI");
        Params.baseModel.registerElement("bank-look-up");
        domesticPayeeModel.init("SEPA");
        domesticPayeeModel.getPaymentTypes().done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.paymentTypes.push({
                    text: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });
                self.paymentTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
            }
            self.sepaType(self.sepaType() || data.enumRepresentations[0].data[0].code);
            self.isPaymentTypesLoaded(true);
        });
        self.validateCode = [{
            "validate": function (value) {
                if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.domestic.invalidError));
                }
            }
        }];
        self.verifyCode = function () {
            var tracker = document.getElementById("verify-bankCode-tracker");
            if (tracker.valid === "valid") {
                domesticPayeeModel.getBankDetails(self.bankDetailsCode()).done(function (data) {
                    self.additionalBankDetails(data);
                });
            }
        };
        self.resetCode = function () {
            self.bankDetailsCode(null);
            self.additionalBankDetails(null);
        };
        self.openLookup = function () {
            $("#menuButtonDialog").trigger("openModal");
        };
    };
});