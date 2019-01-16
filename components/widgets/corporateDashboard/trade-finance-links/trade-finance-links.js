define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/trade-finance-links"
], function (oj, ko, $, TradeFinanceLinksModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.tradeFinanceLinksResourceBundle = locale;
        var i, l;
        var tradeFinanceLinksType = rootParams.type || rootParams.dashboard.application();
        rootParams.baseModel.registerElement([
            "account-input",
            "action-widget"
        ]);
        self.modulesLoaded = ko.observable(false);
        self.tradeFinanceLinks = ko.observableArray();
        self.valueAssigner = function (data) {
            for (var l = data.length, i = l; i--;) {
                data[i].description = self.tradeFinanceLinksResourceBundle.tradeFinanceLinks[data[i].name.split(".")[0]][data[i].name.split(".")[1]];
            }
            return data;
        };
        TradeFinanceLinksModel.getJSONData().then(function (data) {
            var components = data[tradeFinanceLinksType] || data.default;
            for (l = components.length, i = l; i--;) {
                rootParams.baseModel.registerComponent(components[i].id, components[i].module);
            }
            var localArray = self.valueAssigner(components);
            self.tradeFinanceLinks.removeAll();
            ko.utils.arrayPushAll(self.tradeFinanceLinks, localArray);
            self.modulesLoaded(true);
        });
        self.callShowDetails = function (component, data, action) {
            if (self.additionalDetails && self.additionalDetails() && data.taskCode) {
                TradeFinanceLinksModel.validateAccess(self.additionalDetails().account.id.value, data.taskCode).then(function () {
                    rootParams.dashboard.loadComponent(data.id, self.additionalDetails() ? self.additionalDetails().account : action);
                });
            } else {
                var parameters;
                if (self.additionalDetails && self.additionalDetails()) {
                    parameters = self.additionalDetails().account;
                } else if (action) {
                    parameters = action;
                } else {
                    parameters = { type: data.type };
                }
                rootParams.dashboard.loadComponent(data.id, parameters);
            }
        };
    };
});
