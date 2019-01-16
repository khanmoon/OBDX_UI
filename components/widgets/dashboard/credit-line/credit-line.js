define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/accounts-overview",
    "ojs/ojchart",
    "ojs/ojselectcombobox",
    "ojs/ojvalidation"
], function (oj, ko, $, CreditLineUsageModel, temp, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        self.series = ko.observableArray();
        self.selectedPartyID = ko.observableArray();
        self.lines = ko.observableArray();
        self.segregatedData = ko.observableArray();
        self.originalData = null;
        self.creditCardLineLimitLoaded = ko.observable(false);
        self.legendObject = rootParams.baseModel.large() ? {
            position: "end",
            maxSize: "50%"
        } : { position: "bottom" };
        self.mainFunction = function (data) {
            var utilizedLimit = [], remainingLimit = [];
            self.lines.removeAll();
            self.series.removeAll();
            for (var i = 0; i < data.lineLimitsDTOs.length; i++) {
                utilizedLimit.push(data.lineLimitsDTOs[i].utilizedLimit.amount);
                remainingLimit.push(data.lineLimitsDTOs[i].totalLimit.amount - data.lineLimitsDTOs[i].utilizedLimit.amount);
                self.lines.push(data.lineLimitsDTOs[i].lineName);
            }
            ko.utils.arrayPushAll(self.series, [
                {
                    name: self.nls.accountDetails.labels.utilizedAmount,
                    items: utilizedLimit,
                    color: "#e40004"
                },
                {
                    name: self.nls.accountDetails.labels.remainingAmount,
                    items: remainingLimit,
                    color: "#3caf85"
                }
            ]);
        };
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
        CreditLineUsageModel.fetchLines().done(function (data) {
            var result = rootParams.baseModel.groupBy(data.lineLimitsDTOs, function (item) {
                return [
                    item.partyId.value,
                    item.partyName
                ];
            });
            ko.utils.arrayPushAll(self.segregatedData, result);
            self.segregatedData.unshift({
                accounts: data.lineLimitsDTOs,
                id: "all",
                name: self.nls.accountDetails.labels.all
            });
            self.originalData = data;
            self.mainFunction(data);
            self.creditCardLineLimitLoaded(true);
        });
        self.selectedPartyID.subscribe(function (newValue) {
            if (newValue[0] === "all") {
                self.mainFunction(self.originalData);
            } else {
                var partyLineLimit = self.segregatedData().filter(function (element) {
                    return element.id === newValue[0];
                });
                self.mainFunction({ lineLimitsDTOs: partyLineLimit[0].accounts });
            }
        });
        var converterFactory = oj.Validation.converterFactory("number");
        var currencyConverter = converterFactory.createConverter({
            style: "currency",
            currency: "USD"
        });
        self.yAxisConverter = ko.observable(currencyConverter);
        self.styleDefaults = ko.pureComputed(function () {
            return { barGapRatio: 0.6 };
        });
    };
});