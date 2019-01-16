define([
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/wallet-add",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function (ko, $, WalletAddModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.showConfirm = ko.observable(false);
        self.wallet = ResourceBundle.wallet;
        self.common = ResourceBundle.common;
        self.validationTracker = ko.observable();
        self.transactionReferenceNo = ko.observable();
        self.returnCancelURL = ko.observable();
        self.returnURL = ko.observable();
        self.merchantId = ko.observable();
        self.gatewayURL = ko.observable();
        self.transactionAmount = ko.observable();
        self.mobileNumber = ko.observable();
        self.emailId = ko.observable();
        rootParams.baseModel.registerElement("comment-box");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        WalletAddModel.init(rootParams.dashboard.dataToBePassed().walletId.value);
        var getNewKoModel = function () {
            var KoModel = WalletAddModel.getNewModel();
            KoModel.payInDTO.transactionAmount.amount = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.transactionAmount.amount));
            KoModel.payInDTO.comments = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.comments));
            return KoModel;
        };
        self.transactionDetails = getNewKoModel();
        self.showConfirmScreen = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.showConfirm(true);
        };
        self.cancelTransfer = function () {
            self.showConfirm(false);
        };
        self.walletUserData = ko.observable();
        WalletAddModel.getWalletDetails().done(function (data) {
            self.walletUserData(data);
        });
        self.addFund = function () {
            self.transactionDetails.payInDTO.transactionAmount.currency = self.walletCurrency();
            WalletAddModel.addFunds(ko.toJSON(self.transactionDetails)).done(function (data) {
                self.gatewayURL(data.payInDTO.gateWayConfigDTO.gatewayURL);
                self.transactionReferenceNo(data.payInDTO.transactionReferenceNo);
                self.returnCancelURL(data.payInDTO.gateWayConfigDTO.returnCancelURL);
                self.returnURL(data.payInDTO.gateWayConfigDTO.returnURL);
                self.merchantId(data.payInDTO.gateWayConfigDTO.merchantId);
                self.transactionAmount(data.payInDTO.transactionAmount.amount);
                self.mobileNumber(self.walletUserData().mobileNo);
                self.emailId(self.walletUserData().emailId);
                var f = document.createElement("form");
                f.setAttribute("method", "POST");
                f.setAttribute("id", "aggregator");
                f.setAttribute("action", self.gatewayURL());
                var i = document.createElement("input");
                i.setAttribute("type", "hidden");
                i.setAttribute("name", "transactionAmount");
                i.setAttribute("value", self.transactionAmount());
                f.appendChild(i);
                i = document.createElement("input");
                i.setAttribute("type", "hidden");
                i.setAttribute("name", "mobileNumber");
                i.setAttribute("value", self.mobileNumber());
                f.appendChild(i);
                i = document.createElement("input");
                i.setAttribute("type", "hidden");
                i.setAttribute("name", "emailId");
                i.setAttribute("value", self.emailId());
                f.appendChild(i);
                i = document.createElement("input");
                i.setAttribute("type", "hidden");
                i.setAttribute("name", "returnCancelURL");
                i.setAttribute("value", self.returnCancelURL());
                f.appendChild(i);
                i = document.createElement("input");
                i.setAttribute("type", "hidden");
                i.setAttribute("name", "returnURL");
                i.setAttribute("value", self.returnURL());
                f.appendChild(i);
                i = document.createElement("input");
                i.setAttribute("type", "hidden");
                i.setAttribute("name", "merchantId");
                i.setAttribute("value", self.merchantId());
                f.appendChild(i);
                i = document.createElement("input");
                i.setAttribute("type", "hidden");
                i.setAttribute("name", "transactionReferenceNo");
                i.setAttribute("value", self.transactionReferenceNo());
                f.appendChild(i);
                document.getElementById("wallet-add-verify").appendChild(f);
                f.submit();
            });
        };
    };
});