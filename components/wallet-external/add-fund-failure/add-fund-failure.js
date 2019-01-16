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
        WalletAddSuccessModel.init();
        self.confirmationMsg1 = ko.observable();
        self.wallet = ResourceBundle.wallet;
        self.transactionReferenceNo = ko.observable();
        self.confirmationMsg1(rootParams.baseModel.format(self.wallet.pay.referenceNum, { refnumber: self.transactionReferenceNo() }));
        var getNewKoModel = function () {
            var KoModel = WalletAddSuccessModel.getNewModel();
            return KoModel;
        };
        self.gatewayTransactionDetails = getNewKoModel();
        self.showDashboard = function () {
            window.location = "../pages/wallet.html";
        };
    };
});