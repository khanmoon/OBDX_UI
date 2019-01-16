define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/financial-position-currency",
    "ojs/ojinputtext",
    "ojs/ojchart",
    "ojs/ojselectcombobox"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        self.originalData = JSON.parse(JSON.stringify(self.accountsData()));
        self.accountsData = ko.observable();
        self.creaditCardsData = ko.observable();
        self.liability = ko.observableArray();
        self.assets = ko.observableArray();
        self.barSeriesValue = ko.observableArray();
        self.barGroupsValue = ko.observableArray();
        self.resultObj = ko.observableArray();
        self.showChart = ko.observable(false);
        self.selectedPartyID = ko.observableArray();
        self.legendObject = rootParams.baseModel.large() ? {
            position: "end",
            maxSize: "50%"
        } : { position: "bottom" };
        self.stackValue = ko.observable("on");
        self.stackValueChart = ko.observable("on");
        self.legendSections = [{
                title: self.nls.financialPositionDetails.labels.liabilityLabel.type,
                items: [
                    {
                        className: "liability",
                        text: self.nls.financialPositionDetails.labels.liabilityLabel,
                        id: self.nls.financialPositionDetails.labels.liabilityLabel
                    },
                    {
                        className: "assets",
                        text: self.nls.financialPositionDetails.labels.assetsLabel,
                        id: self.nls.financialPositionDetails.labels.assetsLabel
                    }
                ]
            }];
        self.getSum = function (array) {
            var sum = 0;
            if (array && array.length > 0) {
                for (var j = 0; j < array.length; j++) {
                    if (array[j].type === "LON") {
                        sum = sum + array[j].outstandingAmount.amount;
                    } else if (array[j].type === "CSA" || array[j].type === "TRD") {
                        sum = sum + array[j].availableBalance.amount;
                    } else if (array[j].type === "CCA") {
                        if (array[j].cardType === "PRIMARY") {
                            sum = sum + array[j].due.equivalentBilledAmount.amount;
                        }
                    }
                }
            }
            return sum;
        };
        self.mainFunction = function (value) {
            self.showChart(false);
            self.assetItems = [];
            self.liabilityItems = [];
            self.currencyList = [];
            self.liability([]);
            self.assets([]);
            self.resultObj([]);
            self.currency = [];
            var partyAccountData;
            if (value) {
                partyAccountData = self.segregatedData().filter(function (element) {
                    return element.id === value[0];
                });
            }
            if (rootParams.dashboard.isDashboard()) {
                self.accountsData(value ? partyAccountData[0] : self.originalData);
                self.creaditCardsData(rootParams.rootModel.creaditCardsData());
            }
            ko.utils.arrayForEach(self.accountsData().accounts, function (item) {
                if (item.type === "CSA" || item.type === "TRD") {
                    if (item.availableBalance.amount > 0) {
                        self.assets()[item.currencyCode] = self.assets()[item.currencyCode] || [];
                        self.currencyList.push(item.currencyCode);
                        self.assets()[item.currencyCode].push(item);
                    } else {
                        self.liability()[item.currencyCode] = self.liability()[item.currencyCode] || [];
                        self.currencyList.push(item.currencyCode);
                        self.liability()[item.currencyCode].push(item);
                    }
                } else if (item.type === "LON") {
                    self.liability()[item.currencyCode] = self.liability()[item.currencyCode] || [];
                    self.currencyList.push(item.currencyCode);
                    self.liability()[item.currencyCode].push(item);
                }
            });
            ko.utils.arrayForEach(self.creaditCardsData().creditcards, function (item) {
                item.type = "CCA";
                self.liability()[item.cardCurrency] = self.liability()[item.cardCurrency] || [];
                self.currencyList.push(item.cardCurrency);
                self.liability()[item.cardCurrency].push(item);
            });
            if (self.currencyList.length > 0) {
                self.currency = ko.utils.arrayGetDistinctValues(self.currencyList).sort();
                ko.utils.arrayForEach(self.currency, function (item) {
                    self.resultObj.push({
                        currency: item,
                        assets: self.getSum(self.assets()[item], item),
                        liabilities: -self.getSum(self.liability()[item], item)
                    });
                });
                ko.utils.arrayForEach(self.resultObj(), function (item) {
                    self.assetItems.push(item.assets);
                    self.liabilityItems.push(item.liabilities);
                });
                var barSeries = [
                    {
                        name: self.nls.financialPositionDetails.labels.assetsLabel,
                        categories: [self.nls.financialPositionDetails.labels.assetsLabel],
                        className: "assets",
                        displayInLegend: "off",
                        items: self.assetItems
                    },
                    {
                        name: self.nls.financialPositionDetails.labels.liabilityLabel,
                        categories: [self.nls.financialPositionDetails.labels.liabilityLabel],
                        className: "liability",
                        displayInLegend: "off",
                        items: self.liabilityItems
                    }
                ];
                self.barSeriesValue(barSeries);
                var barGroups = self.currency;
                self.barGroupsValue(barGroups);
                self.showChart(true);
            }
        };
        self.mainFunction();
        self.selectedPartyID.subscribe(function (newValue) {
            if (newValue[0] === "all") {
                self.mainFunction();
            } else {
                self.mainFunction(newValue);
            }
        });
    };
});