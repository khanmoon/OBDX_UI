define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/transactions",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource"
], function (oj, ko, AccountsFinancialModel, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
        self.transactionListLoaded = ko.observable(false);
        rootParams.baseModel.registerElement("date-time");
        var transactionList;
        self.arrayDataSource = new oj.ArrayTableDataSource([], { idAttribute: "transactionId" });
        if (rootParams.dashboard.isDashboard() === false && rootParams.baseModel.small()) {
            rootParams.dashboard.headerName(self.Nls.labels.ACCOUNT_FINANCIAL);
        }
        self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);
        self.customList = function (data) {
            transactionList = data.transactionDTOs;
            transactionList = $.map(data.transactionDTOs, function (transaction) {
                transaction.type = transaction.taskDTO.name;
                transaction.debitAccountNumber = transaction.accountId.displayValue;
                transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
                transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.processingDetails.status;
                transaction.status = self.Nls.status[transaction.approvalDetails.status];
                if (transaction.amount) {
                    transaction.amount = rootParams.baseModel.formatCurrency(transaction.amount.amount, transaction.amount.currency);
                }
                transaction.initiatedBy = rootParams.baseModel.format(self.Nls.labels.createdBy, {
                    FName: transaction.createdByDetails.firstName,
                    LName: transaction.createdByDetails.lastName
                });
                if (transaction.approvalDetails.status === "PENDING_APPROVAL" && transaction.maxApprovalDate && transaction.maxApprovalDate !== null)
                    transaction.isInGracePeriod = true;
                else
                    transaction.isInGracePeriod = false;
                return transaction;
            });
        };
        self.onTransactionRowClicked = function (event) {
            rootParams.dashboard.loadComponent("transaction-detail", event, self);
        };
        self.gracePeriodPopUpMessage = function (index) {
            $("#gracePeriodPopup_" + index).ojPopup({
                position: {
                    my: {
                        horizontal: "start",
                        vertical: "top"
                    },
                    offset: {
                        x: -50,
                        y: 5
                    },
                    at: {
                        horizontal: "start",
                        vertical: "bottom"
                    }
                }
            });
            $("#gracePeriodPopup_" + index).ojPopup("open", "#gracePeriodID_" + index);
        };
        self.gracePeriodPopUpCloseMessage = function (index) {
            $("#gracePeriodPopup_" + index).ojPopup("close", "#gracePeriodID_" + index);
        };
        self.fetchTransactionList = function () {
            AccountsFinancialModel.getTransactionList(rootParams.rootModel.view, self.fromDate && self.fromDate(), self.toDate && self.toDate()).done(function (data) {
                self.customList(data);
                self.transactionListLoaded(true);
                self.arrayDataSource.reset(transactionList || [], { idAttribute: "transactionId" });
            });
        };
        self.fetchTransactionList();
    };
});