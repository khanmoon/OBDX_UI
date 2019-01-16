define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/transactions",
    "framework/js/constants/constants",
    "ojs/ojdatetimepicker"
], function (ko, $, Model, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        rootParams.baseModel.registerElement("action-widget");
        rootParams.baseModel.registerElement("nav-bar");
        rootParams.baseModel.registerComponent("transaction-detail", "approvals");
        self.totalCount = ko.observable(0);
        self.filterDateRange = ko.observable(false);
        self.refreshTransactionLog = ko.observable(true);
        self.widgetHeading = ko.observable("");
        self.hostDate = ko.observable();
        self.context = self;
        self.currentSelection = ko.observable().extend({ notify: "always" });
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
        var financialTxnList = [];
        var nonFinancialTxnList = [];
        self.financialTxnCount = ko.observable(0);
        self.nonFinancialTxnCount = ko.observable(0);
        self.userSegment = Constants.userSegment;
        self.setData = function (data) {
            self.menuCountOptions.removeAll();
            self.totalCount(0);
            self.financialTxnCount(0);
            self.nonFinancialTxnCount(0);
            self.totalCount(0);
            financialTxnList.length = 0;
            nonFinancialTxnList.length = 0;
            if (data.countDTOList && data.countDTOList.length) {
                for (var j = 0; j < data.countDTOList.length; j++) {
                    var count = (data.countDTOList[j].initiated || 0) + (data.countDTOList[j].approved || 0) + (data.countDTOList[j].rejected || 0);
                    var record = {
                        label: self.Nls.labels[data.countDTOList[j].transactionType],
                        id: "APPROVED_" + data.countDTOList[j].transactionType,
                        count: ko.observable(count)
                    };
                    if (Constants.userSegment === "ADMIN" || Constants.userSegment === "CORPADMIN") {
                        self.menuCountOptions.push(record);
                    } else if (financialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
                        financialTxnList.push(record);
                        self.financialTxnCount(self.financialTxnCount() + count);
                    } else if (nonFinancialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
                        nonFinancialTxnList.push(record);
                        self.nonFinancialTxnCount(self.nonFinancialTxnCount() + count);
                    }
                    self.totalCount(self.totalCount() + count);
                }
                self.widgetHeading(rootParams.baseModel.format(self.Nls.labels.approvedLogHeader, { count: self.totalCount() }));
                if (!rootParams.dashboard.isDashboard()) {
                    rootParams.dashboard.headerName(self.widgetHeading());
                }
            }
            self.currentSelection("financialTxn_approved");
        };
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.showModule = function (module) {
            self.menuSelection(module.id);
            rootParams.dashboard.headerName(self.widgetHeading());
        };
        self.controls = {
            ctrl2: function () {
                if (self.filterDateRange()) {
                    self.filterDateRange(false);
                } else {
                    self.filterDateRange(true);
                }
            }
        };
        self.currentSelection.subscribe(function (newValue) {
            if (Constants.userSegment !== "ADMIN" && Constants.userSegment !== "CORPADMIN") {
                self.menuCountOptions.removeAll();
            }
            if (newValue === "financialTxn_approved") {
                ko.utils.arrayPushAll(self.menuCountOptions, financialTxnList);
            } else if (newValue === "nonfinancialTxn_approved") {
                ko.utils.arrayPushAll(self.menuCountOptions, nonFinancialTxnList);
            }
            if (rootParams.baseModel.large() && self.menuCountOptions().length) {
                self.menuSelection(self.menuCountOptions()[0].id);
            }
        });
        self.dateFilter = function () {
            Model.getTransactionsList(self.fromDate(), self.toDate()).then(function (data) {
                self.refreshTransactionLog(false);
                ko.tasks.runEarly();
                self.setData(data);
                self.refreshTransactionLog(true);
            });
        };
        self.dateFilter();
    };
});
