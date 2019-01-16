define([
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/maker-work-box",
    "framework/js/constants/constants",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox"
], function (ko, $, Model, resourceBundle, Constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        rootParams.baseModel.registerElement([
            "action-widget",
            "nav-bar"
        ]);
        rootParams.baseModel.registerComponent("transaction-detail", "approvals");
        rootParams.baseModel.registerComponent("accounts-financial", "approvals");
        rootParams.baseModel.registerComponent("accounts-non-financial", "approvals");
        rootParams.baseModel.registerComponent("beneficiary", "approvals");
        rootParams.baseModel.registerComponent("bulk", "approvals");
        rootParams.baseModel.registerComponent("payment-transactions", "approvals");
        rootParams.baseModel.registerComponent("bulk-record", "approvals");
        rootParams.baseModel.registerComponent("bulk-record-non-financial", "approvals");
        rootParams.baseModel.registerComponent("bulk-file-non-financial", "approvals");
        rootParams.baseModel.registerComponent("trade-finance-approval", "approvals");
        rootParams.baseModel.registerComponent("other-transactions-approval", "approvals");
        rootParams.baseModel.registerComponent("forex-deal-transactions", "approvals");
        self.totalCount = ko.observable(0);
        self.filterDateRange = ko.observable(false);
        self.refreshTransactionLog = ko.observable(true);
        self.widgetHeading = ko.observable("");
        self.hostDate = ko.observable();
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        self.context = self;
        self.txnType = ko.observable().extend({
            notify: "always"
        });
        self.loadModule = ko.observable();
        self.dataUpdated = ko.observable(false);
        self.txnListData = ko.observableArray([]);
        self.menuCountOptions = ko.observableArray();
        self.menuSelection = ko.observable();
        self.view = "approved";
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
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
            "FOREX_DEAL",
            "OTHER_TRANSACTION"
        ];
        var financialTxnList = [];
        var nonFinancialTxnList = [];
        var txnList = [
            "financialTxn",
            "nonFinancialTxn"
        ];
        ko.utils.arrayPushAll(self.txnListData, txnList);
        self.comboBoxComponent = ko.observable().extend({
            loaded: false
        });
        self.financialTxnCount = ko.observable(0);
        self.nonFinancialTxnCount = ko.observable(0);
        self.userSegment = Constants.userSegment;
        self.setData = function (data) {
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
                        label: rootParams.baseModel.format(self.Nls[data.countDTOList[j].transactionType + "_COUNT"], {
                            count: count
                        }),
                        id: "APPROVED_" + data.countDTOList[j].transactionType,
                        countForHeader: count
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
                if ((!rootParams.dashboard.isDashboard()) && rootParams.baseModel.small()) {
                    rootParams.dashboard.headerName(self.widgetHeading());
                }
                self.txnType("financialTxn");
            }
        };
        self.txnType.subscribe(function (newValue) {
            self.dataUpdated(false);
            ko.tasks.runEarly();
            if (newValue === "financialTxn") {
                self.menuCountOptions.removeAll();
                ko.utils.arrayPushAll(self.menuCountOptions, financialTxnList);
            } else {
                self.menuCountOptions.removeAll();
                ko.utils.arrayPushAll(self.menuCountOptions, nonFinancialTxnList);
            }
            if (rootParams.baseModel.large()) {
                self.menuSelection(self.menuCountOptions().length ? self.menuCountOptions()[0].id : "");
            }
            self.dataUpdated(true);
        });
        self.menuSelection.subscribe(function (newValue) {
            self.loadComponentData(newValue);
        });
        self.loadComponentData = function (newValue) {
            var value;
            if (!rootParams.baseModel.large()) {
                value = newValue.id;
            } else {
                value = newValue;
            }
            switch (value) {
                case "APPROVED_ACCOUNT_FINANCIAL":
                    self.loadModule("accounts-financial");
                    break;
                case "APPROVED_ACCOUNT_NON_FINANCIAL":
                    self.loadModule("accounts-non-financial");
                    break;
                case "APPROVED_PAYMENTS":
                    self.loadModule("payment-transactions");
                    break;
                case "APPROVED_BULK_FILE":
                    self.loadModule("bulk");
                    break;
                case "APPROVED_NON_FINANCIAL_BULK_FILE":
                    self.loadModule("bulk-file-non-financial");
                    break;
                case "APPROVED_NON_FINANCIAL_BULK_RECORD":
                    self.loadModule("bulk-record-non-financial");
                    break;
                case "APPROVED_PAYEE_BILLER":
                    self.loadModule("beneficiary");
                    break;
                case "APPROVED_BULK_RECORD":
                    self.loadModule("bulk-record");
                    break;
                case "APPROVED_TRADE_FINANCE":
                    self.loadModule("trade-finance-approval");
                    break;
                case "APPROVED_FOREX_DEAL":
                    self.loadModule("forex-deal-transactions");
                    break;
                case "APPROVED_OTHER_TRANSACTION":
                    self.loadModule("other-transactions-approval");
                    break;
                default:
                    self.loadModule("accounts-financial");
                    break;
            }
            if (!rootParams.baseModel.large()) {
                rootParams.dashboard.loadComponent(self.loadModule(), newValue);
            }
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
        self.dateFilter = function () {
            Model.getTransactionsList(self.fromDate(), self.toDate()).then(self.setData);
        };
        self.dateFilter();
    };
});
