define([
    "ojs/ojcore",
    "knockout",
    "./model",
    "jquery",
    "ojL10n!resources/nls/recent-payments",
    "ojs/ojcore",
    "ojs/ojknockout",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojlistview"
], function (oj, ko, PaymentModel, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        self.transactionListLoaded = ko.observable(false);
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        var LAST_N_PAYMENTS = 5;
        rootParams.baseModel.registerElement("date-time");
        var transactionList;
        self.arrayDataSource = new oj.ArrayTableDataSource([], {
            idAttribute: "transactionId"
        });
        self.customList = function (data) {
            transactionList = data.transactionDTOs;
            transactionList = $.map(data.transactionDTOs, function (transaction) {
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
                return transaction;
            });
            transactionList.length = transactionList.length > LAST_N_PAYMENTS ? LAST_N_PAYMENTS : transactionList.length;
        };
        self.fetchTransactionList = function () {
            var view = self.view;
            if (rootParams.staticData) {
                self.transactionListLoaded(false);
            } else {
                PaymentModel.getTransactionList(view, self.fromDate(), self.toDate()).then(function (data) {
                    self.customList(data);
                    if (transactionList.length > 0) {
                        self.arrayDataSource.reset(transactionList || [], {
                            idAttribute: "transactionId"
                        });
                        self.transactionListLoaded(true);
                    } else {
                        self.transactionListLoaded(false);
                    }
                });
            }
        };
        self.fetchTransactionList();
    };
});
