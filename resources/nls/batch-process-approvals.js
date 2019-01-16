define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var BatchProcessApprovalsLocale = function() {
    return {
      root: {
        batchProcessApprovals: {
          reject: "Reject",
          approve: "Approve",
          otherTransactionsApproval: "{nature} Transactions Approval",
          selectedTransactions: "Selected Transactions ({count})",
          remarks: "Remarks (Optional)",
          cancel: "Cancel",
          confirm: "Confirm",
          modify: "Request for Modification",
          allSuccessText_REJECT: "{successCount} Transaction(s) successfully rejected",
          allSuccessText_APPROVE: "{successCount} Transaction(s) successfully approved",
          someSuccessText_REJECT: "{successCount} Transaction(s) successfully rejected, {failureCount} transaction(s) failed",
          someSuccessText_APPROVE: "{successCount} Transaction(s) successfully approved, {failureCount} transaction(s) failed",
          transactionMessage: "Transaction {task} successfully.",
          removeMessage: "Click here to remove the message",
          removeMessageTitle: "Click to remove the message",
          graceWindowMessage: "The Transaction Ids that Value dates are going to change",
          approvalComment: "Approval Comment",
          ACCOUNT_FINANCIAL: "Accounts",
          ACCOUNT_NON_FINANCIAL: "Accounts",
          BULK_FILE: "Bulk File",
          BULK_RECORD: "Bulk Record",
          NON_FINANCIAL_BULK_FILE: "Bulk File",
          NON_FINANCIAL_BULK_RECORD: "Bulk Record",
          PAYEE_BILLER: "Payee and Biller",
          PAYMENTS: "Payments",
          TRADE_FINANCE: "Trade Finance",
          OTHER_TRANSACTION: "Others",
          ADMIN_MAINTENANCE: "Admin Maintenance",
          PARTY_MAINTENANCE: "Party Maintenance"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new BatchProcessApprovalsLocale();
});