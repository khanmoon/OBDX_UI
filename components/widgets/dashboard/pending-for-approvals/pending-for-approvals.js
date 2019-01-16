define([
    "knockout",
    "jquery"

], function (ko, $) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("pending-approvals", "approvals");
        self.dataSourceMapper = function (data, discriminator, resourceBundle) {
            $.map(data.transactionDTOs, function (transaction) {

                transaction.type = transaction.taskDTO.name;
                transaction.noOfApprovalSteps = transaction.approvalDetails.countOfApprovals;
                transaction.processingStatus = transaction.approvalDetails.status === "EXPIRED" ? "E" : transaction.processingDetails.status;
                transaction.initiatedBy = rootParams.baseModel.format(resourceBundle.generic.common.name, {
                    firstName: transaction.createdByDetails.firstName,
                    lastName: transaction.createdByDetails.lastName
                });
                transaction.status = resourceBundle.pendingApprovalsDetails.status[transaction.approvalDetails.status];
                transaction.date = rootParams.baseModel.formatDate(transaction.creationDate);
                switch (discriminator) {
                case "ACCOUNT_FINANCIAL_PENDING":
                case "ACCOUNT_NON_FINANCIAL_PENDING":
                    transaction.accountId = transaction.accountId.displayValue;
                    if (transaction.amount) {
                        transaction.amount = rootParams.baseModel.formatCurrency(transaction.amount.amount, transaction.amount.currency);
                    }
                    break;
                case "NON_FINANCIAL_BULK_FILE_PENDING":

                    transaction.type = resourceBundle.pendingApprovalsDetails.labels.file;
                    transaction.fileIdentifierDetails = transaction.transactionSnapshot.fileIdentifier + "-" + transaction.transactionSnapshot.fileIdentifierDescription;
                    transaction.referenceNo = transaction.fileRefId;
                    break;
                case "NON_FINANCIAL_BULK_RECORD_PENDING":
                    transaction.valueDate = rootParams.baseModel.formatDate(transaction.creationDate);
                    transaction.recRefId = transaction.transactionSnapshot.recRefId;

                    transaction.type = resourceBundle.pendingApprovalsDetails.labels.record;
                    transaction.referenceNo = transaction.recRefId;
                    transaction.fileIdentifierDetails = transaction.transactionSnapshot.fileIdentifier + "-" + transaction.transactionSnapshot.fileIdentifierDescription;
                    break;
                case "PAYMENTS_PENDING":
                    transaction.amount = rootParams.baseModel.formatCurrency(transaction.amount.amount, transaction.amount.currency);
                    transaction.beneficiaryAccountNumber = transaction.creditAccountId.displayValue || "";
                    transaction.beneficiaryName = transaction.creditAccountName || "";
                    transaction.debitAccountNumber = transaction.accountId.displayValue;
                    break;
                case "BULK_FILE_PENDING":
                    transaction.description = transaction.fileIdentifierDescription;
                    transaction.type = resourceBundle.pendingApprovalsDetails.labels.file;

                    transaction.referenceNo = transaction.fileRefId;
                    if (transaction.amount) {
                        transaction.amount = rootParams.baseModel.formatCurrency(transaction.amount.amount, transaction.amount.currency);
                    }
                    break;
                case "BULK_RECORD_PENDING":
                    transaction.valueDate = rootParams.baseModel.formatDate(transaction.creationDate);


                    transaction.type = resourceBundle.pendingApprovalsDetails.labels.record;
                    transaction.debitAccountNumber = transaction.debitAccountNumber.displayValue;

                    transaction.referenceNo = transaction.recRefId;
                    if (transaction.amount) {
                        transaction.amt = rootParams.baseModel.formatCurrency(transaction.amount.amount, transaction.amount.currency);
                    }
                    transaction.payeeDetails = transaction.creditAccountNumber + (transaction.beneName ? "-" + transaction.beneName : "");
                    break;
                case "PAYEE_BILLER_PENDING":
                    transaction.category = resourceBundle.pendingApprovalsDetails.labels[transaction.category];
                    break;
                case "PARTY_MAINTENANCE_PENDING":
                    if (transaction.partyName) {
                        transaction.partyName = transaction.partyName.fullName;
                    }
                    break;
                case "ADMIN_MAINTENANCE_PENDING":
                    break;
                default:
                    break;
                }
            });
            return data.transactionDTOs;
        };
    };
});
