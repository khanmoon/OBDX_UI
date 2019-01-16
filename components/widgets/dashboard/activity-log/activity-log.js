define([
  "knockout",
  "jquery",

  "ojL10n!resources/nls/generic"
], function(ko, $, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    rootParams.baseModel.registerComponent("transactions-log", "approvals");
    rootParams.baseModel.registerComponent("accounts-financial", "approvals");
    rootParams.baseModel.registerComponent("accounts-non-financial", "approvals");
    rootParams.baseModel.registerComponent("beneficiary", "approvals");
    rootParams.baseModel.registerComponent("bulk", "approvals");
    rootParams.baseModel.registerComponent("payment-transactions", "approvals");
    rootParams.baseModel.registerComponent("bulk-record", "approvals");
    rootParams.baseModel.registerComponent("bulk-file-non-financial", "approvals");
    rootParams.baseModel.registerComponent("bulk-record-non-financial", "approvals");
    rootParams.baseModel.registerComponent("trade-finance-approval", "approvals");
    rootParams.baseModel.registerComponent("corporate-activity-log", "approvals");
    rootParams.baseModel.registerComponent("other-transactions-approval", "approvals");
    rootParams.baseModel.registerComponent("admin-activity-log", "approvals");
    rootParams.baseModel.registerComponent("bulk-file-admin", "approvals");
    rootParams.baseModel.registerComponent("bulk-record-admin", "approvals");
    rootParams.baseModel.registerComponent("forex-deal-transactions", "approvals");
    self.menuSelection = ko.observable();
    self.menuCountOptions = ko.observableArray();
    self.loadModule = ko.observable();
    self.toDate = ko.observable();
    self.fromDate = ko.observable();
    self.nls = resourceBundle;
    self.menuSelection.subscribe(function(newValue) {
      switch (newValue) {
        case "ACCOUNT_FINANCIAL":
          self.loadModule("accounts-financial");
          break;
        case "ACCOUNT_NON_FINANCIAL":
          self.loadModule("accounts-non-financial");
          break;
        case "PAYMENTS":
          self.loadModule("payment-transactions");
          break;
        case "BULK_FILE":
          self.loadModule("bulk");
          break;
        case "NON_FINANCIAL_BULK_FILE":
          self.loadModule("bulk-file-non-financial");
          break;
        case "PAYEE_BILLER":
          self.loadModule("beneficiary");
          break;
        case "BULK_RECORD":
          self.loadModule("bulk-record");
          break;
        case "NON_FINANCIAL_BULK_RECORD":
          self.loadModule("bulk-record-non-financial");
          break;
        case "TRADE_FINANCE":
          self.loadModule("trade-finance-approval");
          break;
        case "OTHER_TRANSACTION":
          self.loadModule("other-transactions-approval");
          break;
        case "PARTY_MAINTENANCE":
          self.loadModule("corporate-activity-log");
          break;
        case "ADMIN_MAINTENANCE":
          self.loadModule("admin-activity-log");
          break;
        case "BULK_FILE_ADMIN":
          self.loadModule("bulk-file-admin");
          break;
        case "BULK_RECORD_ADMIN":
          self.loadModule("bulk-record-admin");
          break;
        case "FOREX_DEAL":
        self.loadModule("forex-deal-transactions");
        break;
        default:
          break;
      }
      if (!rootParams.baseModel.large()) {
        rootParams.dashboard.loadComponent(self.loadModule(), {
          countForHeader: self.menuCountOptions().filter(function(obj) {
            return obj.value === self.menuSelection();
          })[0].count()
        }, self);
      }
    });
  };
});
