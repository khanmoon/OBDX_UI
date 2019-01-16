define([
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/wallet-decline",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function (ko, $, WalletDeclineModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.wallet = ResourceBundle.wallet;
        self.common = ResourceBundle.common;
        rootParams.dashboard.headerName(self.wallet.decline.header);
        rootParams.baseModel.registerElement("page-section");
        WalletDeclineModel.init(rootParams.dashboard.dataToBePassed().walletId.value);
        self.declineRequest = function () {
            WalletDeclineModel.deleteRequest(self.requestId).done(function () {
                window.location.href = "wallet.html";
            });
        };
        self.cancelDecline = function () {
            window.location.href = "wallet.html";
        };
    };
});