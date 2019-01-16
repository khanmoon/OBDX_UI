define([
    "knockout",
    "jquery",
    "./model",
    "ojs/ojfilmstrip",
    "ojs/ojbutton"
], function (ko, $, WalletAlertModel) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        self.notifications = ko.observableArray();
        self.showFilmStrip = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("wallet-notification-card", "wallet");
        self.maxCardWidth = ko.observable(window.innerWidth - 40);
        WalletAlertModel.init(rootParams.dashboard.dataToBePassed().walletId.value);
        var getNewKoModel = function () {
            var KoModel = WalletAlertModel.getNewModel();
            return KoModel;
        };
        $(window).resize(function () {
            self.maxCardWidth(window.innerWidth - 40);
        });
        self.notificationDetails = getNewKoModel();
        self.repaint = function () {
            self.showFilmStrip(false);
            WalletAlertModel.fetchNotifications().done(function (data) {
                self.notifications([]);
                self.notifications.push(data);
                self.showFilmStrip(true);
            });
        };
        WalletAlertModel.fetchNotifications().done(function (data) {
            self.notifications.push(data);
            self.showFilmStrip(true);
        });
    };
});