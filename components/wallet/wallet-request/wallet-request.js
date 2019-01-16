define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "./model",
    "baseLogger",

    "base-models/validations/obdx-locale",
    "ojL10n!resources/nls/wallet-request",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function (ko, $, oj, WalletRequestModel, BaseLogger, validator, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.requestedParty = ko.observable();
        self.wallet = ResourceBundle.wallet;
        self.common = ResourceBundle.common;
        self.showConfirm = ko.observable(false);
        self.validationTracker = ko.observable();
        self.buttonEnable = ko.observable(true);
        rootParams.baseModel.registerElement("comment-box");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        WalletRequestModel.init(rootParams.dashboard.dataToBePassed().walletId.value);
        var getNewKoModel = function () {
            var KoModel = WalletRequestModel.getNewModel();
            KoModel.amount.amount = ko.observable(ko.utils.unwrapObservable(KoModel.amount.amount));
            KoModel.comments = ko.observable(ko.utils.unwrapObservable(KoModel.comments));
            return KoModel;
        };
        function chkRegex(regex, str) {
            var patt = new RegExp(regex);
            return patt.test(str);
        }
        self.requestDetails = getNewKoModel();
        self.validateRecepient = {
            validate: function (value) {
                if (isNaN(value)) {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.EMAIL[0].options.pattern), value)) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(validator.validationMessages.EMAIL[0].options.messageDetail));
                    }
                    self.requestDetails.payeeEmail = value;
                } else {
                    if (!chkRegex(decodeURIComponent(validator.validationMessages.MOBILE_NO[0].options.pattern), value)) {
                        throw new oj.ValidatorError("", oj.Translations.getTranslatedString(validator.validationMessages.MOBILE_NO[0].options.messageDetail));
                    }
                    self.requestDetails.payeeNumber = value;
                }
                return true;
            }
        };
        self.cancelTransfer = function () {
            self.showConfirm(false);
        };
        self.showConfirmScreen = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.showConfirm(true);
        };
        self.requestFund = function () {
            self.buttonEnable(true);
            self.requestDetails.amount.currency = self.walletCurrency();
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                self.buttonEnable(true);
                return;
            }
            WalletRequestModel.requestFunds(ko.toJSON(self.requestDetails)).done(function () {
                self.confirmationMsg1(self.wallet.request.successMsg);
                self.openComponent = ko.observable("wallet-success");
                rootParams.baseModel.registerComponent("wallet-success", "wallet");
                rootParams.dashboard.loadComponent(self.openComponent(), {}, self);
            });
        };
    };
});