define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/domestic-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function (oj, ko, $, domesticPayeeModel, BaseLogger, ResourceBundle, commonPayee, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.domestic = ko.toJS(Params.model);
        self.validationTracker = Params.validator;
        self.payments = commonPayee.payments;
        self.payments.payee.domestic = ResourceBundle.payments.payee.domestic;
        self.payeeDetails = ko.observable(self.domestic);
        self.domesticPayeeType = ko.observable("INDIA");
        self.network("IFSC");
        self.groupValid = ko.observable();
        self.refreshLookup(true);
        self.openLookup = function () {
            $("#menuButtonDialog").trigger("openModal");
        };
        Params.baseModel.registerElement("bank-look-up");
        self.validateCode = [{
            "validate": function (value) {
                if (value.length > 11 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.domestic.invalidError));
                }
            }
        }];
        $(document).on("keyup", "#domSwiftCode", function() {
            $(this).val($(this).val().toUpperCase());
        });
        self.verifyCode = function () {
            var tracker = document.getElementById("verify-code-tracker");
            if (tracker.valid === "valid") {
                domesticPayeeModel.getBankDetailsDCC(self.bankDetailsCode()).done(function (data) {
                    self.additionalBankDetails(data);
                });
            }
        };
    };
});