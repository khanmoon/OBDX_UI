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
], function (oj, ko, BulkModel, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.Nls = resourceBundle;
        self.transactionListLoaded = ko.observable(false);
        self.countForHeader = rootParams.rootModel.params ? rootParams.rootModel.params.countForHeader : "";
        var transactionList;
        rootParams.baseModel.registerElement("date-time");
        if (rootParams.dashboard.isDashboard() === false) {
            rootParams.dashboard.headerName(self.Nls.labels.BULK_FILE);
        }
        self.arrayDataSource = new oj.ArrayTableDataSource([], { idAttribute: "referenceNo" });
        self.paginationDataSource = new oj.PagingTableDataSource(self.arrayDataSource);
        self.customList = function (data) {
            transactionList = data.transactionDTOs;
            transactionList = $.map(data.transactionDTOs, function (transaction) {
                transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.processingDetails.status;
                transaction.status = self.Nls.status[transaction.approvalDetails.status];
                transaction.fileIdentifierDetail = transaction.transactionSnapshot.fileIdentifier + "-" + transaction.transactionSnapshot.fileIdentifierDescription;
                transaction.valueDate = rootParams.baseModel.formatDate(transaction.creationDate, "dateTimeStampFormat");
                transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
                transaction.referenceNo = transaction.fileRefId;
                transaction.transactionType = transaction.transactionSnapshot.accountType;
                transaction.initiatedBy = rootParams.baseModel.format(self.Nls.labels.createdBy, {
                    FName: transaction.createdByDetails.firstName,
                    LName: transaction.createdByDetails.lastName
                });
                return transaction;
            });
        };
        self.onTransactionRowClicked = function (event) {
            rootParams.dashboard.loadComponent("transaction-detail", event, self);
        };
        self.fetchTransactionList = function () {
            BulkModel.getTransactionList(rootParams.rootModel.view, self.fromDate && self.fromDate(), self.toDate && self.toDate()).done(function (data) {
                self.customList(data);
                self.arrayDataSource.reset(transactionList || [], { idAttribute: "referenceNo" });
                self.transactionListLoaded(true);
            });
        };
        self.fetchTransactionList();
    };
});