define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "base-models/validations/obdx-locale",
    "ojs/ojknockout",
    "ojs/ojdatetimepicker",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation"
], function (oj, ko, $, BaseLogger, validator) {
    "use strict";
    return function viewModel(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootParams);
        self.isReadOnly = Params.readOnly;
        self.report = Params.report;
        self.dataLoaded = ko.observable(true);
        self.validationTracker = ko.observable();
        function chkRegex(regex, str) {
            var patt = new RegExp(regex);
            return patt.test(str);
        }
        self.validateEmail = {
            validate: function (value) {
                if (value === "") {
                    return true;
                }
                if (isNaN(value)) {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.EMAIL[0].options.pattern), value)) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(validator.validationMessages.EMAIL[0].options.messageDetail));
                    }
                }
                if (self.report === "kyc") {
                    self.resetDefault();
                }
                return true;
            }
        };
        self.validateMobile = {
            validate: function (value) {
                if (value === "") {
                    return true;
                }
                if (!chkRegex(decodeURIComponent(validator.validationMessages.MOBILE_NO[0].options.pattern), value)) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(validator.validationMessages.MOBILE_NO[0].options.messageDetail));
                }
                if (self.report === "kyc") {
                    self.resetDefault();
                }
                return true;
            }
        };
        self.reset = function () {
            self.searchItems().emailId("");
            self.searchItems().userId("");
            self.searchItems().mobileNumber("");
            self.searchItems().fromDate(Params.baseModel.getDate().toJSON().slice(0, 10));
            self.searchItems().toDate(Params.baseModel.getDate().toJSON().slice(0, 10));
            self.searchItems().status(self.statusSearchArray()[0].code);
            self.stageThree(false);
        };
        self.resetDefault = function () {
            self.searchItems().fromDate("");
            self.searchItems().toDate("");
            self.searchItems().status("");
        };
        self.search = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.searchItems().fromDate() === null) {
                self.searchItems().fromDate("");
            }
            if (self.searchItems().toDate() === null) {
                self.searchItems().toDate("");
            }
            if (self.report === "kyc") {
                self.url = "wallets?emailId={emailId}&fromDate={fromDate}&toDate={toDate}&kycStatus={status}&mobileNo={mobile}";
            } else if (self.report === "openToday") {
                self.url = "wallets?fromDate={fromDate}&toDate={toDate}";
            } else if (self.report === "useractivity") {
                if (self.searchItems().emailId() === "" && self.searchItems().mobileNumber() === "") {
                    $("#searchErrorDialog").trigger("openModal");
                    self.searchError(true);
                    self.searchErrorMsg(self.wallet.search.errormsg);
                    return;
                }
                self.url = "wallets?emailId={emailId}&mobileNo={mobile}";
            } else if (self.report === "transactionActivity") {
                if (self.searchItems().emailId() === "" && self.searchItems().mobileNumber() === "") {
                    $("#searchErrorDialog").trigger("openModal");
                    self.searchError(true);
                    self.searchErrorMsg(self.wallet.search.errormsg);
                    return;
                }
                self.url = "wallets/reports/transactionActivity?emailId={emailId}&mobileNo={mobile}&transactionType={transactionType}&fromDate={fromDate}&toDate={toDate}";
            }
            self.fetchReport(self.url, self.report);
        };
        if (self.report === "openToday") {
            self.search();
        }
    };
});