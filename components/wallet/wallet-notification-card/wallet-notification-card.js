define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/wallet-external"
], function (ko, $, WalletNotificationModel, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        ko.utils.extend(self, rootParams);
        self.wallet = ResourceBundle.wallet;
        self.imageSrc = ko.observable(rootParams.data.image);
        self.searchErrorMsg = ko.observable(self.wallet.notification.insufficientfund);
        WalletNotificationModel.init(rootParams.dashboard.dataToBePassed().walletId.value);
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerComponent("wallet-pay", "wallet");
        rootParams.baseModel.registerComponent("wallet-decline", "wallet");
        self.declineRequest = function (data) {
            self.openComponent = ko.observable("wallet-decline");
            rootParams.dashboard.loadComponent(self.openComponent(), rootParams.data, data);
        };
        self.acceptRequest = function (data) {
            if (data.data.amount > self.walletAmount()) {
                $("#searchErrorDialog").trigger("openModal");
                return;
            }
            self.openComponent = ko.observable("wallet-pay");
            rootParams.dashboard.headerName(self.wallet.notification.header);
            rootParams.dashboard.loadComponent(self.openComponent(), rootParams.data, data);
        };
    };
});