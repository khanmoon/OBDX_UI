define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/accounts-overview",
    "ojs/ojinputtext",
    "ojs/ojchart"
], function(ko, $, accountsModel, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        self.totalAccount = ko.observable();
        self.totalAmount = ko.observable();
        self.currency = ko.observable();
        self.type = rootParams.dashboard.application();
        self.dataAvailable = ko.observable(true);
        self.loadImage = ko.observable().extend({
            loaded: false
        });
        self.nls = resourceBundle;
        var totalAccount = 0,
            totalValue = 0,
            i, baseCcy;

        function setData(data) {
            if (data.summary && data.summary.items) {
                var summary = data.summary.items;
                if (self.type === "loans") {
                    self.loadImage("dashboard/loans-icon.svg");
                    for (i = 0; i < summary.length; i++) {
                        totalAccount += summary[i].count;
                        totalValue += summary[i].totalActiveOutstandingBalance.amount;
                        baseCcy = summary[i].totalActiveOutstandingBalance.currency;
                    }
                } else {
                    for (i = 0; i < summary.length; i++) {
                        totalAccount += summary[i].count;
                        totalValue += summary[i].totalActiveAvailableBalance.amount;
                        baseCcy = summary[i].totalActiveAvailableBalance.currency;
                    }
                    if (self.type === "demand-deposits") {
                        self.loadImage("dashboard/casa-icon.svg");
                    } else {
                        self.loadImage("dashboard/td-icon.svg");
                    }
                }
                self.totalAccount(totalAccount);
                self.totalAmount(totalValue);
                self.currency(baseCcy);
                self.dataAvailable(true);
            } else {
                self.dataAvailable(false);
            }
        }
        var type = null;
        if (self.type === "loans") {
            type = "loan";
        } else if (self.type === "term-deposits") {
            type = "deposit";
        } else {
            type = "demandDeposit";
        }
        accountsModel.fetchAccounts(type).then(function(data) {
            setData(data);
        });
    };
});