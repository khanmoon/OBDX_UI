define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/inactive-accounts-card"
], function (ko, $, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.count = ko.observable(0);
        self.inactiveAccountList = ko.observable([]);
        self.cardData = "dashboard.inactiveAccounts.inactiveAccount";
        self.image = "demand-deposits/closed-accounts.svg";
        rootParams.baseModel.registerElement("object-card");
        rootParams.baseModel.registerComponent("inactive-accounts-list", "demand-deposits");
        self.cardData = {
            title: self.locale.inactiveAccounts.title,
            description: self.locale.inactiveAccounts.description,
            linkText: self.locale.inactiveAccounts.linkText
        };
        if (rootParams.dashboard.dataToBePassed() && rootParams.dashboard.dataToBePassed().accounts) {
            for (var i = 0; i < rootParams.dashboard.dataToBePassed().accounts.length; i++) {
                if (rootParams.dashboard.dataToBePassed().accounts[i].status === "DORMANT") {
                    self.inactiveAccountList().push(rootParams.dashboard.dataToBePassed().accounts[i]);
                    self.count(self.count() + 1);
                }
            }
        }
    };
});