define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/demand-deposit-list",
    "ojs/ojfilmstrip"
], function (ko, $, UserAccountsModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.accountInfo = ko.observableArray();
        self.dataFetched = ko.observable(false);
        self.multipleModulesPresent = ko.observable();
        self.maxCardWidth = ko.observable(window.innerWidth - 40);
        rootParams.baseModel.registerElement("card");
        rootParams.baseModel.registerComponent("demand-deposit-details", "demand-deposits");
        rootParams.baseModel.registerComponent("demand-deposit-debit-details", "demand-deposits");

        UserAccountsModel.fetchBankConfig().done(function (data) {
            if (data.bankConfigurationDTO.moduleList.length > 1) {
                self.multipleModulesPresent(true);
            } else {
                self.multipleModulesPresent(false);
            }
            self.dataFunction();
        });
        self.loadData = function (data) {
            self.accountInfo(data.accounts);
            if (data.accounts) {
                self.accountInfo.sort(function (left, right) {
                    return left.holdingPattern === right.holdingPattern ? 0 : left.holdingPattern > right.holdingPattern ? -1 : 1;
                });
                if (data !== null || data !== "") {
                    self.dataFetched(true);
                }
            }
        };
        self.loadSelectedCard = function (params) {
            params.applicationType = "demand-deposits";
            rootParams.dashboard.loadComponent("manage-accounts", params);
        };
        self.dataFunction = function () {

            UserAccountsModel.fetchAccountInfo().done(function (data) {
                self.loadData(data);
            });

        };
        $(window).resize(function () {
            self.maxCardWidth(window.innerWidth - 40);
        });
    };
});