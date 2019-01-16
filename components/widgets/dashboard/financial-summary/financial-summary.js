define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/td-summary",
    "ojL10n!resources/nls/account-summary",
    "ojL10n!resources/nls/loan-summary",
    "ojL10n!resources/nls/financial-summary",
    "ojs/ojtable",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, FinancialSummaryModel, $, tdResourceBundle, casaResourceBundle, loanResourceBundle, finResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerComponent("account-details", "demand-deposits");
        rootParams.baseModel.registerComponent("td-corporate-details", "term-deposits");
        rootParams.baseModel.registerComponent("loan-corporate-details", "loans");
        self.nls = finResourceBundle;
        self.accounts = {};
        var types = [];
        self.showSummaryData = ko.observable(false);
        function checkCurrency(searchData, chkCurrency) {
            var position = -1;
            $(searchData).each(function (k, v) {
                if (v.currency === chkCurrency) {
                    position = k;
                    return false;
                }
            });
            return position;
        }
        FinancialSummaryModel.getAccountDetails().done(function (data) {
            $(data.accounts).each(function (index, item) {
                var ccyBalance;
                if (!self.accounts[item.type]) {
                    types.push(item.type);
                    self.accounts[item.type] = {};
                    self.accounts[item.type].ccywisePosition = [];
                    self.accounts[item.type].datasource = {};
                    self.accounts[item.type].accountList = [];
                    self.accounts[item.type].htmlTemplate = item.type === "CSA" ? "dd-summary" : item.type === "TRD" ? "td-summary" : "loan-summary";
                    if (item.type === "CSA") {
                        self.accounts[item.type].accountDetaislLoaded = ko.observable(true);
                        self.accounts[item.type].nls = casaResourceBundle;
                        self.accounts[item.type].moreTitle = self.nls.labels.ddDetailsTitle;
                        self.accounts[item.type].moreAlt = self.nls.labels.ddDetails;
                    } else if (item.type === "TRD") {
                        self.accounts[item.type].tdSummaryLoaded = ko.observable(true);
                        self.accounts[item.type].nls = tdResourceBundle;
                        self.accounts[item.type].moreTitle = self.nls.labels.tdDetailsTitle;
                        self.accounts[item.type].moreAlt = self.nls.labels.tdDetails;
                    } else if (item.type === "LON") {
                        self.accounts[item.type].loanAccountDetaislLoaded = ko.observable(true);
                        self.accounts[item.type].nls = loanResourceBundle;
                        self.accounts[item.type].moreTitle = self.nls.labels.loanDetailsTitle;
                        self.accounts[item.type].moreAlt = self.nls.labels.loanDetails;
                    }
                    self.accounts[item.type].hideDetailsTable = ko.observable(false);
                }
                if (item.type === "CSA") {
                    ccyBalance = item.availableBalance;
                } else if (item.type === "TRD") {
                    ccyBalance = item.maturityAmount;
                } else if (item.type === "LON") {
                    ccyBalance = item.outstandingAmount;
                }
                var position = checkCurrency(self.accounts[item.type].ccywisePosition, ccyBalance.currency);
                if (position < 0) {
                    self.accounts[item.type].ccywisePosition.push({
                        currency: ccyBalance.currency,
                        noOfAccount: 1,
                        totalBal: ccyBalance.amount
                    });
                } else {
                    self.accounts[item.type].ccywisePosition[position].noOfAccount++;
                    self.accounts[item.type].ccywisePosition[position].totalBal += ccyBalance.amount;
                }
                self.accounts[item.type].accountList.push(item);
            });
            for (var index = 0; index < types.length; index++) {
                self.accounts[types[index]].accountList = $.map(self.accounts[types[index]].accountList, function (val) {
                    val.accountId = val.id.value;
                    return val;
                });
                self.accounts[types[index]].datasource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.accounts[types[index]].accountList, { idAttribute: "accountId" }));
                if (types[index] === "CSA") {
                    self.accounts[types[index]].datasource.sort({
                        key: "rawAvailableBalance",
                        direction: "descending"
                    });
                } else if (types[index] === "TRD") {
                    self.accounts[types[index]].datasource.sort({
                        key: "rawMaturityDate",
                        direction: "ascending"
                    });
                } else if (types[index] === "LON") {
                    self.accounts[types[index]].datasource.sort({
                        key: "rawMaturityDate",
                        direction: "ascending"
                    });
                }
            }
            self.showSummaryData(true);
        });
        self.showSummaryDetails = function (section, vm, event) {
            $(event.target).toggleClass("icon-more icon-more");
            self.accounts[section].hideDetailsTable(!self.accounts[section].hideDetailsTable());
        };
        self.showAccountDetails = function (data) {
            if (data.type === "CSA") {
                rootParams.dashboard.loadComponent("account-details", data);
            } else if (data.type === "TRD") {
                rootParams.dashboard.loadComponent("td-corporate-details", data);
            } else if (data.type === "LON") {
                rootParams.dashboard.loadComponent("loan-corporate-details", data);
            }
        };
    };
});