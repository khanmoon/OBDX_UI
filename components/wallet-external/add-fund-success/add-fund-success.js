define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/wallet-external"
], function (ko, $, WalletAddSuccessModel, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.confirmationMsg2 = ko.observable();
        self.wallet = ResourceBundle.wallet;
        self.success = ko.observable(false);
        self.failure = ko.observable(false);
        self.confirmationMsg1 = ko.observable();
        rootParams.baseModel.registerComponent("wallet-status", "wallet");
        WalletAddSuccessModel.init();
        self.transactionReferenceNo = ko.observable();
        var getNewKoModel = function () {
            var KoModel = WalletAddSuccessModel.getNewModel();
            KoModel.payInDTO.transactionReferenceNo = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.transactionReferenceNo));
            KoModel.payInDTO.transactionAmount.amount = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.transactionAmount.amount));
            KoModel.payInDTO.comments = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.comments));
            KoModel.payInDTO.transactionStatus = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.transactionStatus));
            KoModel.payInDTO.bankReferenceNo = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.bankReferenceNo));
            return KoModel;
        };
        self.gatewayTransactionDetails = getNewKoModel();
        if (self.bankReferenceNo()) {
            self.gatewayTransactionDetails.payInDTO.bankReferenceNo(self.bankReferenceNo());
            self.gatewayTransactionDetails.payInDTO.transactionReferenceNo(self.transactionReferenceNo());
            self.gatewayTransactionDetails.payInDTO.transactionAmount.amount(self.amount);
            WalletAddSuccessModel.completeTransaction(self.transactionReferenceNo(), ko.toJSON(self.gatewayTransactionDetails)).done(function (data) {
                self.confirmationMsg1(rootParams.baseModel.format(self.wallet.pay.referenceNum, { refnumber: data.payInDTO.transactionReferenceNo }));
                self.success(true);
            }).fail(function () {
                self.confirmationMsg1(rootParams.baseModel.format(self.wallet.pay.referenceNum, { refnumber: self.transactionReferenceNo() }));
                self.failure(true);
            });
        }
        self.showDashboard = function () {
            window.location = "../pages/wallet.html";
        };
    };
});