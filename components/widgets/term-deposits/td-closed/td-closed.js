define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/td-closed"
], function (ko, $, TermDepositClosedModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = locale;
        self.numberCount = ko.observable();
        self.count = ko.observable();
        self.cardData = {
            title: self.nls.dashboard.closeTermDeposit.closedDeposit_title,
            linkText: self.nls.dashboard.closeTermDeposit.closedDeposit_viewall,
            description: self.nls.dashboard.closeTermDeposit.closedDeposit_description
        };
        self.image = "term-deposits/closed-term-deposits.svg";
        self.accounts = ko.observableArray();
        TermDepositClosedModel.getClosedDeposits().done(function (data) {
            if (data.accounts) {
                ko.utils.arrayPushAll(self.accounts, data.accounts);
            }
            self.numberCount(self.accounts() ? self.accounts().length : 0);
            self.count(self.numberCount());
        });
        rootParams.baseModel.registerElement("object-card");
        rootParams.baseModel.registerComponent("td-closed-list", "term-deposits");
    };
});