define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "ojL10n!resources/nls/td-accounts-overview",
    "./model",
    "ojs/ojinputtext",
    "ojs/ojchart",
    "ojs/ojlegend"
], function (ko, $, oj, resourceBundle, Model) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerElement("action-widget");
        self.nls = resourceBundle;
        self.totalCurrentBal = ko.observable(0);
        self.totalInvestment = ko.observable(0);
        self.totalMaturityAmount = ko.observable(0);
        self.baseCcy = ko.observable();
        var accountNumberCount = 0;
        self.orientationValue = ko.observable("horizontal");
        self.tdOverviewGroupValue = ko.observableArray();
        self.yAxisConverter = ko.observable();
        self.tdOverviewBarSeriesValue = ko.observableArray();
        self.count = ko.observable(0);
        self.barGapRatio = ko.observable(0.6);
        self.maxBarWidth = ko.observable(10);
        self.horizAlign = ko.observable("center");
        self.vertAlign = ko.observable("middle");
        if (!rootParams.baseModel.large()) {
            self.barGapRatio = ko.observable(0.4);
            self.maxBarWidth = ko.observable(8);
        }
        self.accountsList = ko.observable();
        self.accountsLoaded = ko.observable(false);

        self.typeOfAccounts = [{
          id: "CON",
          label: self.nls.accountDetails.labels.conventionalAccount
        }, {
          id: "ISL",
          label: self.nls.accountDetails.labels.islamicAccount
        }];

        self.selectedAccountTypeChangedHandler = function(event){
          self.tdOverviewBarSeriesValue.removeAll();
          if(event.detail.value === "CON"){
            self.totalCurrentBal(self.accountsList().summary.items[0].totalActiveAvailableBalance.amount);
            self.totalInvestment(self.accountsList().summary.items[0].totalActiveInvestmentAmount.amount);
            self.totalMaturityAmount(self.accountsList().summary.items[0].totalActiveMaturityAmount.amount);
            self.baseCcy(self.accountsList().summary.items[0].totalActiveMaturityAmount.currency);
          }else{
            self.totalCurrentBal(self.accountsList().summary.items[0].totalISLActiveAvailableBalance.amount);
            self.totalInvestment(self.accountsList().summary.items[0].totalISLActiveInvestmentAmount.amount);
            self.totalMaturityAmount(self.accountsList().summary.items[0].totalISLActiveMaturityAmount.amount);
            self.baseCcy(self.accountsList().summary.items[0].totalISLActiveMaturityAmount.currency);
          }

                for (var i = 0; i < self.accountsList().accounts.length; i++) {
                    if (self.accountsList().accounts[i].status === "ACTIVE") {
                        accountNumberCount += 1;
                    }
                }
                self.count(accountNumberCount);
                var converterFactory = oj.Validation.converterFactory("number");
                var currencyConverter = converterFactory.createConverter({
                    style: "currency",
                    currency: self.baseCcy()
                });
                self.yAxisConverter(currencyConverter);
                self.tdOverviewGroupValue([
                    rootParams.baseModel.format(self.nls.accountDetails.labels.investments, {
                        amount: rootParams.baseModel.formatCurrency(self.totalInvestment(), self.baseCcy())
                    }),
                    rootParams.baseModel.format(self.nls.accountDetails.labels.currentBalance, {
                        amount: rootParams.baseModel.formatCurrency(self.totalCurrentBal(), self.baseCcy())
                    }),
                    rootParams.baseModel.format(self.nls.accountDetails.labels.maturityAmount, {
                        amount: rootParams.baseModel.formatCurrency(self.totalMaturityAmount(), self.baseCcy())
                    })
                ]);
                self.tdOverviewBarSeriesValue.push({
                    items: [{
                            value: self.totalInvestment(),
                            className: "totalInvestment",
                            svgStyle: "styleLabel",
                            labelStyle: "totalInvestment"
                        },
                        {
                            value: self.totalCurrentBal(),
                            className: "totalCurrentBal",
                            labelStyle: "totalCurrentBal",
                            svgStyle: "styleLabel"
                        },
                        {
                            value: self.totalMaturityAmount(),
                            className: "totalMaturityAmount",
                            labelStyle: "totalMaturityAmount",
                            svgStyle: "styleLabel"
                        }
                    ]
                });
                self.legendSections = ko.observableArray([{
                    items: [{
                            text: rootParams.baseModel.format(self.nls.accountDetails.labels.investments, {
                                amount: rootParams.baseModel.formatCurrency(self.totalInvestment(), self.baseCcy())
                            }),
                            color: "#007fd9"
                        },
                        {
                            text: rootParams.baseModel.format(self.nls.accountDetails.labels.currentBalance, {
                                amount: rootParams.baseModel.formatCurrency(self.totalCurrentBal(), self.baseCcy())
                            }),
                            color: "#3ca241"
                        },
                        {
                            text: rootParams.baseModel.format(self.nls.accountDetails.labels.maturityAmount, {
                                amount: rootParams.baseModel.formatCurrency(self.totalMaturityAmount(), self.baseCcy())
                            }),
                            color: "#f5b73d"
                        }
                    ]
                }]);

            self.styleDefaults = ko.pureComputed(function () {
                return {
                    barGapRatio: self.barGapRatio(),
                    maxBarWidth: self.maxBarWidth()
                };
            });
        };
        Model.fetchAccounts().then(function (data) {
          if(data && data.summary){
            self.accountsList(data);
            self.accountsLoaded(true);
          }
        });
    };
});
