define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",

    "ojL10n!resources/nls/transactions",

    "ojs/ojcore",
    "ojs/ojknockout",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource"
], function (oj, ko, PaymentModel, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
        rootParams.baseModel.registerElement("date-time");
        rootParams.baseModel.registerComponent("transaction-detail", "approvals");
        var transactionList = ko.observableArray();
        if (rootParams.dashboard.isDashboard() === false) {
            rootParams.dashboard.headerName(self.Nls.labels.PAYMENTS);
        }
        self.paginationDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(transactionList, { idAttribute: "transactionId" }));
        self.customList = function (data) {
            return $.map(data.transactionDTOs, function (transaction) {
                transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.processingDetails.status;
                transaction.status = self.Nls.status[transaction.approvalDetails.status];
                transaction.type = transaction.taskDTO.name;
                transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
                transaction.amount = rootParams.baseModel.formatCurrency(transaction.amount.amount, transaction.amount.currency);
                transaction.date = rootParams.baseModel.formatDate(transaction.valueDate, "timestamp");
                transaction.debitAccountNumber = transaction.accountId.displayValue || "";
                transaction.beneficiaryAccountNumber = transaction.creditAccountId.displayValue || "";
                transaction.beneficiaryName = transaction.creditAccountName || "";
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
        PaymentModel.getTransactionList(rootParams.rootModel.view, self.fromDate && self.fromDate(), self.toDate && self.toDate()).done(function (data) {
            transactionList(self.customList(data));
        });
    };
});