define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/generic"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("approved-txn-log", "approvals");
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
        self.menuSelection = ko.observable();
        self.menuCountOptions = ko.observableArray();
        self.loadModule = ko.observable();
        self.toDate = ko.observable();
        self.fromDate = ko.observable();
        self.view = "approved";
        self.nls = resourceBundle;
        self.menuSelection.subscribe(function (newValue) {
            switch (newValue) {
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
            case "APPROVED_OTHER_TRANSACTION":
                self.loadModule("other-transactions-approval");
                break;
            default:
                break;
            }
            if (!rootParams.baseModel.large()) {
                rootParams.dashboard.loadComponent(self.loadModule(), {
                    countForHeader: self.menuCountOptions().filter(function (obj) {
                        return obj.id === self.menuSelection();
                    })[0].count()
                }, self);
            }
        });
    };
});
