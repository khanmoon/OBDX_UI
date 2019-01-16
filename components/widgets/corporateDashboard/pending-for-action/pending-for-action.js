define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/pending-for-action",
    "framework/js/constants/constants",
    "ojs/ojchart",
    "ojs/ojselectcombobox"
], function (oj, ko, $, PendingApprovalModel, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.countList = ko.observableArray([]);
        self.Nls = resourceBundle;
        self.menuCountOptions = ko.observableArray([]);
        self.pieSeriesValue = ko.observableArray();
        self.dataUpdated = ko.observable(false);
        self.txnType = ko.observable().extend({
            notify: "always"
        });
        self.txnListData = ko.observableArray([]);
        var financialTxnList = [];
        var nonFinancialTxnList = [];
        var financialTxn = [
            "ACCOUNT_FINANCIAL",
            "PAYMENTS",
            "BULK_FILE",
            "BULK_RECORD"
        ];
        var nonFinancialTxn = [
            "ACCOUNT_NON_FINANCIAL",
            "PAYEE_BILLER",
            "NON_FINANCIAL_BULK_FILE",
            "NON_FINANCIAL_BULK_RECORD",
            "TRADE_FINANCE",
            "OTHER_TRANSACTION"
        ];
        var countPieSeries = [];
        var index = 0;
        self.financialTxnCount = ko.observable(0);
        self.nonFinancialTxnCount = ko.observable(0);
        var txnList = [
            "financialTxn",
            "nonFinancialTxn"
        ];
        ko.utils.arrayPushAll(self.txnListData, txnList);

        function setCount(data) {
            if (data.countDTOList.length) {
                for (var j = 0; j < data.countDTOList.length; j++) {
                    var count = data.countDTOList[j].pendingApproval || 0;
                    if (data.countDTOList[j].transactionType) {
                        var currData = {
                            label: self.Nls[data.countDTOList[j].transactionType],
                            id: data.countDTOList[j].transactionType + "_PENDING",
                            count: count
                        };
                        self.menuCountOptions.push(currData);
                        if (financialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
                            self.financialTxnCount(self.financialTxnCount() + count);
                            financialTxnList.push(currData);
                        } else if (nonFinancialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
                            self.nonFinancialTxnCount(self.nonFinancialTxnCount() + count);
                            nonFinancialTxnList.push(currData);
                        }
                    }
                }
            }
            self.txnType("financialTxn");
        }
        self.fetchCount = function () {
                PendingApprovalModel.getCountForApproval(Constants.userSegment === "CORPADMIN" ? "PA" : Constants.userSegment === "ADMIN" ? "A" : "P").then(function (data) {
                    setCount(data);
                });
        };
        self.txnType.subscribe(function (newValue) {
            self.dataUpdated(false);
            if (newValue === "financialTxn") {
                self.menuCountOptions.removeAll();
                ko.utils.arrayPushAll(self.menuCountOptions, financialTxnList);
            } else {
                self.menuCountOptions.removeAll();
                ko.utils.arrayPushAll(self.menuCountOptions, nonFinancialTxnList);
            }
            countPieSeries = [];
            for (index = 0; index < self.menuCountOptions().length; index++) {
                countPieSeries[index] = {
                    name: self.menuCountOptions()[index].label,
                    items: [self.menuCountOptions()[index].count]
                };
            }
            self.pieSeriesValue(countPieSeries);
            self.dataUpdated(true);
        });
        self.fetchCount();
        self.tooltip = {
            renderer: function (dataContext) {
              var pieChartNode = document.createElement("div");

              pieChartNode.innerHTML =
                "<div>" +
                    "<div data=\"label\">" + rootParams.baseModel.format(self.Nls.tooltip.series, { series: dataContext.series }) + "</div>" +
                  "<div data=\"amount\">" + rootParams.baseModel.format(self.Nls.tooltip.value, { value: dataContext.data }) + "</div>" +
                "</div>";

                return {"insert" : pieChartNode};

            }
        };
    };
});
