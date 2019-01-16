define([
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/transactions",
  "framework/js/constants/constants",
  "ojs/ojdatetimepicker",
  "ojs/ojbutton"
], function(ko, $, Model, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.Nls = resourceBundle;
    rootParams.baseModel.registerElement("action-widget");
    rootParams.baseModel.registerElement("nav-bar");
    rootParams.baseModel.registerElement("date-time");
    rootParams.baseModel.registerComponent("transaction-detail", "approvals");
    self.totalCount = ko.observable(0);
    self.filterDateRange = ko.observable(false);
    self.refreshTransactionLog = ko.observable(true);
    self.currentSelection = ko.observable().extend({
      notify: "always"
    });
    var view;
    self.context = self;
    self.userSegment = Constants.userSegment;
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
    self.setData = function(data) {
      self.totalCount(0);
      self.financialTxnCount(0);
      self.nonFinancialTxnCount(0);
      financialTxnList.length = 0;
      nonFinancialTxnList.length = 0;
      self.menuCountOptions.removeAll();
      if (data.countDTOList && data.countDTOList.length) {
        for (var j = 0; j < data.countDTOList.length; j++) {
          var count = (data.countDTOList[j].initiated || 0) + (data.countDTOList[j].approved || 0) + (data.countDTOList[j].rejected || 0);
          var currData = {
            label: self.Nls.labels[data.countDTOList[j].transactionType],
            id: data.countDTOList[j].transactionType,
            count: ko.observable(count)
          };
          if (Constants.userSegment === "ADMIN" || Constants.userSegment === "CORPADMIN") {
            self.menuCountOptions.push(currData);
          } else if (financialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
            financialTxnList.push(currData);
            self.financialTxnCount(self.financialTxnCount() + count);
          } else if (nonFinancialTxn.indexOf(data.countDTOList[j].transactionType) > -1) {
            nonFinancialTxnList.push(currData);
            self.nonFinancialTxnCount(self.nonFinancialTxnCount() + count);
          }
          self.totalCount(self.totalCount() + count);
        }
        if ((!rootParams.dashboard.isDashboard()) && rootParams.baseModel.small()) {
          rootParams.dashboard.headerName(rootParams.baseModel.format(self.Nls.labels.activityLogheader, {
            count: self.totalCount()
          }));
        }
      }
      if (self.currentSelection() === "financialTxn") {
        ko.utils.arrayPushAll(self.menuCountOptions, financialTxnList);
      } else {
        ko.utils.arrayPushAll(self.menuCountOptions, nonFinancialTxnList);
      }
    };
    self.uiOptions = {
      "menuFloat": "left",
      "fullWidth": false,
      "defaultOption": self.menuSelection
    };
    self.showModule = function(module) {
      rootParams.dashboard.headerName(rootParams.baseModel.format(self.Nls.labels.activityLogheader, {
        count: self.totalCount()
      }));
      self.menuSelection(module.id);
    };
    self.setView = function(currentView) {
      if (currentView === "viewer") {
        view = "all";
      } else {
        view = "created";
      }
      Model.getTransactionsList(view).then(function(data) {
        self.setData(data);
        self.currentSelection.valueHasMutated();
      });
    };
    self.controls = {
      ctrl2: function() {
        if (self.filterDateRange()) {
          self.filterDateRange(false);
        } else {
          self.filterDateRange(true);
        }
      }
    };
    self.dateFilter = function() {
      Model.getTransactionsList(view, self.fromDate(), self.toDate()).then(function(data) {
        self.refreshTransactionLog(false);
        ko.tasks.runEarly();
        self.setData(data);
        self.refreshTransactionLog(true);
      });
    };
    self.currentSelection.subscribe(function(newValue) {
      if (Constants.userSegment !== "ADMIN" && Constants.userSegment !== "CORPADMIN") {
        self.menuCountOptions.removeAll();
      }
      if (newValue === "financialTxn") {
        ko.utils.arrayPushAll(self.menuCountOptions, financialTxnList);
      } else if (newValue === "nonfinancialTxn") {
        ko.utils.arrayPushAll(self.menuCountOptions, nonFinancialTxnList);
      }
      if (rootParams.baseModel.large()) {
        self.menuSelection(self.menuCountOptions()[0].id);
      }
    });
  };
});
