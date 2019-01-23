define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/account-summary",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function(oj, ko, $, AccountSummaryModel, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.accountDetaislLoaded = ko.observable(false);
        self.realData = ko.observableArray();
        self.filteredAccounts = ko.observableArray();
        self.actionHeaderHeading = self.nls.pageTitle.accountSummaryTitle;
        self.conventionalAccountsAvailable = ko.observable(false);
        self.islamicAccountsAvailable = ko.observable(false);
        self.datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.filteredAccounts, {
            idAttribute: "id"
        }));
        var criteriaMap = {};
        criteriaMap.default = {
            key: "rawAvailableBalance",
            direction: "descending"
        };
        self.typeOfAccounts = [{
            id: "CON",
            label: self.nls.accountSummary.conventionalAccount
        }, {
            id: "ISL",
            label: self.nls.accountSummary.islamicAccount
        }];
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerComponent("account-details", "demand-deposits");
        rootParams.baseModel.registerComponent("td-corporate-details", "term-deposits");

        self.selectedAccountTypeChangedHandler = function(event) {
            self.filteredAccounts.removeAll();

            self.filteredAccounts(self.realData().filter(function(item) {
                return item.module.indexOf(event.detail.value) > -1;
            }));
            self.accountDetaislLoaded(true);
        };

        if (!(rootParams.data && rootParams.data.accountList)) {
            AccountSummaryModel.getAccountDetails().done(function(data) {
                if (data.accounts && data.accounts.length > 0) {
                    self.realData(data.accounts);
                    data.accounts.forEach(function(element) {
                        if (element.module === "CON") {
                            self.conventionalAccountsAvailable(true);
                        } else if (element.module === "ISL") {
                            self.islamicAccountsAvailable(true);
                        }
                    });
                    if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
                        self.filteredAccounts(self.realData());
                        self.accountDetaislLoaded(true);
                    }
                }

            });
        } else {
            self.realData(rootParams.data.accountList);
            rootParams.data.accountList.forEach(function(element) {
                if (element.module === "CON") {
                    self.conventionalAccountsAvailable(true);
                } else if (element.module === "ISL") {
                    self.islamicAccountsAvailable(true);
                }
            });
            if (!(self.conventionalAccountsAvailable() && self.islamicAccountsAvailable())) {
                self.filteredAccounts(self.realData());
                self.accountDetaislLoaded(true);
            }
        }

        self.showAccountDetails = function(data) {
            rootParams.dashboard.loadComponent("account-details", data);
        };
        self.downloadAccounts = function(data) {
            AccountSummaryModel.downloadAccounts(data);
        };
    };
});