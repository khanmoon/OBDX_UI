define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/wallet-success"
], function (ko, $, WalletPaySuccessModel, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.confirmationMsg2 = ko.observable();
        rootParams.dashboard.backAllowed(false);
        self.wallet = ResourceBundle.wallet;
        self.success = ko.observable(false);
        self.failure = ko.observable(false);
        WalletPaySuccessModel.init();
        var getNewKoModel = function () {
            var KoModel = WalletPaySuccessModel.getNewModel();
            KoModel.payInDTO.transactionReferenceNo = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.transactionReferenceNo));
            KoModel.payInDTO.comments = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.comments));
            KoModel.payInDTO.transactionStatus = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.transactionStatus));
            KoModel.payInDTO.bankReferenceNo = ko.observable(ko.utils.unwrapObservable(KoModel.payInDTO.bankReferenceNo));
            return KoModel;
        };
        self.gatewayTransactionDetails = getNewKoModel();
        if (self.bankReferenceNo) {
            self.gatewayTransactionDetails.payInDTO.bankReferenceNo(self.bankReferenceNo);
            self.gatewayTransactionDetails.payInDTO.transactionReferenceNo(self.transactionReferenceNo());
            self.foramtedAmount = ko.observable();
            WalletPaySuccessModel.completeTransaction(self.transactionReferenceNo(), ko.toJSON(self.gatewayTransactionDetails)).done(function () {
                WalletPaySuccessModel.getWallet().done(function (data1) {
                    self.refreshWallet(data1.walletId.value);
                }).fail(function () {
                    self.failure(true);
                });
            }).fail(function () {
                self.failure(true);
            });
        } else {
            WalletPaySuccessModel.getWallet().done(function (data1) {
                self.refreshWallet(data1.walletId.value);
            }).fail(function () {
                self.failure(true);
            });
        }
        self.refreshWallet = function (walletId) {
            WalletPaySuccessModel.getWalletDetails(walletId).done(function (data) {
                self.success(true);
                self.walletAmount(data.balance.availableBalance.amount);
                self.walletCurrency(data.balance.availableBalance.currency);
                self.foramtedAmount(rootParams.baseModel.formatCurrency(self.walletAmount(), self.walletCurrency()));
                self.confirmationMsg2(self.wallet.success.balance + self.foramtedAmount());
            }).fail(function () {
                self.failure(true);
            });
        };
        self.showDashboard = function () {
            window.location = "../pages/wallet.html";
        };
    };
});