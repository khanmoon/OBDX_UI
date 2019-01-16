define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/maker-work-box",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox"
], function (oj, ko, $, Model, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
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
        self.nls = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.workBoxData = ko.observableArray([]);
        self.txnListData = ko.observableArray([]);
        self.heading = self.nls.activityHeader;
        self.selectedClass = ko.observable();
        self.txnType = ko.observable("financialTxn");
        self.filterDateRange = ko.observable(false);
        rootParams.baseModel.registerComponent("accounts-financial", "approvals");
        rootParams.baseModel.registerComponent("accounts-non-financial", "approvals");
        rootParams.baseModel.registerComponent("beneficiary", "approvals");
        rootParams.baseModel.registerComponent("bulk", "approvals");
        rootParams.baseModel.registerComponent("payment-transactions", "approvals");
        rootParams.baseModel.registerComponent("bulk-record", "approvals");
        rootParams.baseModel.registerComponent("bulk-file-non-financial", "approvals");
        rootParams.baseModel.registerComponent("bulk-record-non-financial", "approvals");
        rootParams.baseModel.registerComponent("trade-finance-approval", "approvals");
        rootParams.baseModel.registerComponent("other-transactions-approval", "approvals");
        rootParams.baseModel.registerComponent("transaction-detail", "approvals");
        rootParams.baseModel.registerComponent("forex-deal-transactions", "approvals");
        self.loadModule = ko.observable();
        self.toDate = ko.observable();
        self.fromDate = ko.observable();
        rootParams.baseModel.registerComponent("work-box-corporate", "widgets/corporateDashboard");
        rootParams.baseModel.registerElement([
            "action-widget"
        ]);
        self.view = null;
        self.getRootContext = function ($root) {
            if ($root.currentRole() === "viewer") {
                self.view = "all";
            } else {
                self.view = "created";
            }
            Model.getCountList(self.view).then(function (data) {
                self.setData(data);
                self.dataLoaded(true);
            });
        };
        ko.utils.arrayPushAll(self.txnListData, txnList);


        self.dateFilter = function () {
            var discriminator = self.loadModule();
            self.loadModule(false);
            ko.tasks.runEarly();
            self.loadModule(discriminator);
            Model.getCountList(self.view, self.fromDate(), self.toDate()).then(function(data){
              self.setData(data);
            });
        };
        function txnTypeChanged(newValue) {
            if (newValue === "financialTxn") {
                self.workBoxData.removeAll();
                ko.utils.arrayPushAll(self.workBoxData, financialTxnList);
            } else {
                self.workBoxData.removeAll();
                ko.utils.arrayPushAll(self.workBoxData, nonFinancialTxnList);
            }
            if (rootParams.baseModel.large()) {
                self.loadComponentData(self.workBoxData()[0]);
            }
        }
        self.setData = function (data) {
            if (data.countDTOList && data.countDTOList.length) {
                data = data.countDTOList;
                financialTxnList.length = 0;
                nonFinancialTxnList.length = 0;
                for (var i = 0; i < data.length; i++) {
                    var record = data[i];
                    record.status = [];
                    record.header = resourceBundle[record.transactionType];
                    record.countForHeader = 0;
                    record.status.push({
                        "count": record.approved || 0,
                        "status": resourceBundle.approved,
                        "icon": "icon icon-check"
                    });
                    record.status.push({
                        "count": record.initiated || 0,
                        "status": resourceBundle.initiated,
                        "icon": "icon icon-alert"
                    });
                    record.status.push({
                        "count": record.rejected || 0,
                        "status": resourceBundle.rejected,
                        "icon": "icon icon-close"
                    });
                    if (financialTxn.indexOf(data[i].transactionType) > -1) {
                        financialTxnList.push(record);
                    }
                    if (nonFinancialTxn.indexOf(data[i].transactionType) > -1) {
                        nonFinancialTxnList.push(record);
                    }
                    $(record.status).each(function (k, v) {
                        record.countForHeader = record.countForHeader + parseInt(v.count);
                    });
                }
            }
            txnTypeChanged(self.txnType());
        };
        self.ctrl2 = function () {
            if (self.filterDateRange()) {
                self.filterDateRange(false);
            } else {
                self.filterDateRange(true);
            }
        };

        self.txnType.subscribe(txnTypeChanged);


          self.loadComponentData = function (newValue) {
              var type = newValue.transactionType;
              self.selectedClass(null);
              setTimeout(function () {
                  switch (type) {
                  case "ACCOUNT_FINANCIAL":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("accounts-financial");
                      break;
                  case "ACCOUNT_NON_FINANCIAL":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("accounts-non-financial");
                      break;
                  case "PAYMENTS":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("payment-transactions");
                      break;
                  case "BULK_FILE":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("bulk");
                      break;
                  case "NON_FINANCIAL_BULK_FILE":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("bulk-file-non-financial");
                      break;
                  case "PAYEE_BILLER":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("beneficiary");
                      break;
                  case "BULK_RECORD":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("bulk-record");
                      break;
                  case "NON_FINANCIAL_BULK_RECORD":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("bulk-record-non-financial");
                      break;
                  case "TRADE_FINANCE":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("trade-finance-approval");
                      break;
                  case "PARTY_MAINTENANCE":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("corporate-activity-log");
                      break;
                  case "ADMIN_MAINTENANCE":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("admin-activity-log");
                      break;
                  case "FOREX_DEAL":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("forex-deal-transactions");
                      break;
                  case "OTHER_TRANSACTION":
                      self.selectedClass(type.toLowerCase() + " animate");
                      self.loadModule("other-transactions-approval");
                      break;
                  default:
                      self.loadModule("accounts-financial");
                      break;
                  }
                  if (!rootParams.baseModel.large()) {
                      rootParams.dashboard.loadComponent(self.loadModule(), newValue);
                  }
              }, 100);
          };
    };
});
