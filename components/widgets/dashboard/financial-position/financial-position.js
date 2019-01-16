define([
    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/financial-position"
], function (ko, componentModel, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.accountsData = ko.observable();
        self.creaditCardsData = ko.observable();
        self.isAccountsDataLoaded = ko.observable(false);
        self.isCreditCardsDataLoaded = ko.observable(false);
        self.segregatedData = ko.observableArray();
        self.segregatedSummary = ko.observableArray();
        self.nls = resourceBundle;
        self.additionalDetails = ko.observable();
        rootParams.baseModel.registerComponent("financial-position-graph", "dashboard");
        rootParams.baseModel.registerComponent("financial-position-currency", "dashboard");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        self.groupBy = function (array, callback) {
            var groups = {};
            array.forEach(function (item) {
                var group = JSON.stringify(callback(item));
                groups[group] = groups[group] || [];
                groups[group].push(item);
            });
            return Object.keys(groups).map(function (group) {
                return {
                    id: JSON.parse(group).shift(),
                    accounts: groups[group],
                    name: JSON.parse(group).pop()
                };
            });
        };
        componentModel.fetchAccountsDetails().done(function (data) {
            self.accountsData(data);
            var result = self.groupBy(data.accounts, function (item) {
                return [
                    item.partyId.value,
                    item.partyName
                ];
            });
            ko.utils.arrayPushAll(self.segregatedData, result);
            result = self.groupBy(data.summary.items, function (item) {
                return [
                    item.party ? item.party.value : null,
                    item.partyName ? item.partyName : null
                ];
            });
            ko.utils.arrayPushAll(self.segregatedSummary, result);
            self.segregatedData.unshift({
                accounts: data.accounts,
                id: "all",
                name: self.nls.accountDetails.labels.all
            });
            self.segregatedSummary.unshift({
                accounts: data.summary.items,
                id: "all",
                name: self.nls.accountDetails.labels.all
            });
            self.isAccountsDataLoaded(true);
        });
        componentModel.fetchCreditCardsDetails().done(function (data) {
            self.creaditCardsData(data);
            self.isCreditCardsDataLoaded(true);
        });
    };
});