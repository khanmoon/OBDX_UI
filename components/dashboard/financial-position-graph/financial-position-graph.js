define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/financial-position",
    "ojs/ojchart"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.accountsData = ko.observable();
        self.creaditCardsData = ko.observable();
        self.isAccountsDataLoaded = ko.observable();
        self.isCreditCardsDataLoaded = ko.observable();
        self.totalCASAPositiveAmount = ko.observable();
        self.totalCASANegativeAmount = ko.observable();
        self.totalCreditCardAmount = ko.observable(0);
        self.totalTDAmount = ko.observable();
        self.totalLoanAmount = ko.observable();
        self.baseCcy = ko.observable();
        self.assetsAmount = 0;
        self.liabilitiesAmount = 0;
        self.assetsPieSeriesValue = ko.observableArray();
        self.liabilitiesPieSeriesValue = ko.observableArray();
        self.netWorth = ko.observable(0);
        self.selectedPartyID = ko.observableArray();
        self.nls = resourceBundle;
        self.innerRadius = ko.observable(0.85);
        self.labelStyle = ko.observable("font-size:1.4rem;color:#a6a6a6;");
        rootParams.baseModel.registerElement("action-widget");
        self.ojDonutChartBugFix = function (field_1, field_2) {
            field_1 = ko.utils.unwrapObservable(field_1);
            field_2 = ko.utils.unwrapObservable(field_2);
            if (field_2 && field_2 !== 0) {
                return field_1 / field_2 > 1e-8;
            }
                return true;

        };
        self.labelValue1 = ko.observable();
        self.labelValue = ko.observable();
        var barTooltip = document.createElement("div");
        self.tooltipCallback = function (dataContext) {
            var groupName = dataContext.series ? dataContext.series.replace(/\(.*\)/, "").trim() : void 0;
            var groupValue = rootParams.baseModel.formatCurrency(dataContext.value, self.baseCcy());
            if (groupValue && groupName) {
                require(["text!../partials/charts/tool-tip.html"], function (barTooltipLocal) {
                    var tooltip = {
                        groupName: groupName,
                        groupValue: groupValue,
                        groupNameTitle: self.nls.accountDetails.labels.accountType,
                        groupValueTitle: self.nls.accountDetails.labels.amount,
                        title: self.nls.accountDetails.labels.title
                    };
                    $(barTooltip).html(barTooltipLocal);
                    ko.cleanNode(barTooltip);
                    ko.applyBindings(tooltip, barTooltip);
                });
                return barTooltip;
            }
        };
        self.checkEmpty = function (obj) {
            for (var prop in obj) {
                if (obj[prop]) {
                    return false;
                }
            }
            return true;
        };
        self.pieSliceLabel = function (dataContext) {
            return rootParams.baseModel.format(self.nls.accountDetails.labels.pieSliceLabel, { currency: rootParams.baseModel.formatCurrency(dataContext.value, self.baseCcy()) });
        };
        self.mainFunction = function (value) {
            self.assetsAmount = 0;
            self.liabilitiesAmount = 0;
            self.assetsPieSeriesValue.removeAll();
            self.liabilitiesPieSeriesValue.removeAll();
            self.totalCASAPositiveAmount(0);
            self.totalCASANegativeAmount(0);
            self.totalCreditCardAmount(0);
            self.totalTDAmount(0);
            self.totalLoanAmount(0);
            self.netWorth(0);
            var partyAccountSummary;
            if (value) {
                partyAccountSummary = self.segregatedSummary().filter(function (element) {
                    return element.id === value[0];
                });
            }
            if (rootParams.dashboard.isDashboard()) {
                if (rootParams.rootModel && rootParams.rootModel.accountsData()) {
                    self.accountsData = value ? { summary: { items: partyAccountSummary[0].accounts } } : JSON.parse(JSON.stringify(rootParams.rootModel.accountsData()));
                }
                if (rootParams.rootModel && rootParams.rootModel.creaditCardsData()) {
                    self.creaditCardsData = JSON.parse(JSON.stringify(rootParams.rootModel.creaditCardsData()));
                }
            }
            ko.utils.arrayForEach(self.accountsData.summary.items, function (item) {
                if (item.accountType === "CSA") {
                    self.totalCASAPositiveAmount(self.totalCASAPositiveAmount() + item.totalActiveAvailableBalance.amount);
                    self.totalCASANegativeAmount(item.totalActiveNegativeBalance.amount * -1);
                    if (!self.baseCcy() && item.totalActiveAvailableBalance.currency) {
                        self.baseCcy(item.totalActiveAvailableBalance.currency);
                    }
                    if (!self.baseCcy() && item.totalActiveNegativeBalance.currency) {
                        self.baseCcy(item.totalActiveNegativeBalance.currency);
                    }
                }
                if (item.accountType === "TRD") {
                    self.totalTDAmount(self.totalTDAmount() + item.totalActiveAvailableBalance.amount);
                    if (!self.baseCcy() && item.totalActiveAvailableBalance.currency) {
                        self.baseCcy(item.totalActiveAvailableBalance.currency);
                    }
                }
                if (item.accountType === "LON") {
                    self.totalLoanAmount(self.totalLoanAmount() + item.totalActiveOutstandingBalance.amount);
                    if (!self.baseCcy() && item.totalActiveOutstandingBalance.currency) {
                        self.baseCcy(item.totalActiveOutstandingBalance.currency);
                    }
                }
            });
            if (!self.checkEmpty(self.creaditCardsData.sumOfEquivalentDue)) {
                self.totalCreditCardAmount(self.creaditCardsData.sumOfEquivalentDue.amount);
                if (!self.baseCcy() && self.creaditCardsData.sumOfEquivalentDue.currency) {
                    self.baseCcy(self.creaditCardsData.sumOfEquivalentDue.currency);
                }
            }
            var assetsPieSeries = [];
            var index = 0;
            if (self.totalCASAPositiveAmount() > 0) {
                if (self.ojDonutChartBugFix(self.totalCASAPositiveAmount(), self.totalTDAmount())) {
                    assetsPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.demandDeposits, { amount: rootParams.baseModel.formatCurrency(self.totalCASAPositiveAmount(), self.baseCcy()) }),
                        items: [self.totalCASAPositiveAmount()],
                        className: "assetsCasa"
                    };
                } else {
                    assetsPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.demandDeposits, { amount: "0" }),
                        items: [0],
                        className: "assetsCasa"
                    };
                }
                index = index + 1;
            }
            if (self.totalTDAmount() > 0) {
                if (self.ojDonutChartBugFix(self.totalTDAmount(), self.totalTDAmount())) {
                    assetsPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.termDeposits, { amount: rootParams.baseModel.formatCurrency(self.totalTDAmount(), self.baseCcy()) }),
                        items: [self.totalTDAmount()],
                        className: "assetsTD"
                    };
                } else {
                    assetsPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.termDeposits, { amount: "0" }),
                        items: [0],
                        className: "assetsTD"
                    };
                }
            }
            self.assetsAmount = self.totalCASAPositiveAmount() + self.totalTDAmount();
            self.assetsPieSeriesValue(assetsPieSeries);
            var labelData1 = {
                text: ko.toJS(rootParams.baseModel.formatCurrency(self.assetsAmount, self.baseCcy())),
                style: ko.toJS(self.labelStyle)
            };
            self.labelValue1(labelData1);
            var liabilitiesPieSeries = [];
            index = 0;
            if (self.totalCASANegativeAmount() > 0) {
                if (self.ojDonutChartBugFix(self.totalCASANegativeAmount(), self.totalLoanAmount()) && self.ojDonutChartBugFix(self.totalCASANegativeAmount(), self.totalCreditCardAmount())) {
                    liabilitiesPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.demandDeposits, { amount: rootParams.baseModel.formatCurrency(self.totalCASANegativeAmount(), self.baseCcy()) }),
                        items: [self.totalCASANegativeAmount()],
                        className: "liabilityCasa"
                    };
                } else {
                    liabilitiesPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.demandDeposits, { amount: "0" }),
                        items: [0],
                        className: "liabilityCasa"
                    };
                }
                index = index + 1;
            }
            if (self.totalLoanAmount() > 0) {
                if (self.ojDonutChartBugFix(self.totalLoanAmount(), self.totalCASANegativeAmount()) && self.ojDonutChartBugFix(self.totalLoanAmount(), self.totalCreditCardAmount())) {
                    liabilitiesPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.loans, { amount: rootParams.baseModel.formatCurrency(self.totalLoanAmount(), self.baseCcy()) }),
                        items: [self.totalLoanAmount()],
                        className: "liabilityLoan"
                    };
                } else {
                    liabilitiesPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.loans, { amount: "0" }),
                        items: [0],
                        className: "liabilityLoan"
                    };
                }
                index = index + 1;
            }
            if (self.totalCreditCardAmount() > 0) {
                if (self.ojDonutChartBugFix(self.totalCreditCardAmount(), self.totalCASANegativeAmount()) && self.ojDonutChartBugFix(self.totalCreditCardAmount(), self.totalLoanAmount())) {
                    liabilitiesPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.creditCards, { amount: rootParams.baseModel.formatCurrency(self.totalCreditCardAmount(), self.baseCcy()) }),
                        items: [self.totalCreditCardAmount()],
                        className: "liabilityCreditCard"
                    };
                } else {
                    liabilitiesPieSeries[index] = {
                        name: rootParams.baseModel.format(self.nls.accountDetails.labels.creditCards, { amount: "0" }),
                        items: [0],
                        className: "liabilityCreditCard"
                    };
                }
            }
            self.liabilitiesAmount = self.totalCASANegativeAmount() + self.totalLoanAmount() + self.totalCreditCardAmount();
            self.liabilitiesPieSeriesValue(liabilitiesPieSeries);
            var labelData = {
                text: ko.toJS(rootParams.baseModel.formatCurrency(self.liabilitiesAmount, self.baseCcy())),
                style: ko.toJS(self.labelStyle)
            };
            self.labelValue(labelData);
            if (self.liabilitiesAmount > 0) {
                self.netWorth(rootParams.baseModel.formatCurrency(self.assetsAmount - self.liabilitiesAmount, self.baseCcy()));
            } else {
                self.netWorth(rootParams.baseModel.formatCurrency(self.assetsAmount, self.baseCcy()));
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