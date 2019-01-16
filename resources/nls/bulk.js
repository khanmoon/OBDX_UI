define([], function() {
  "use strict";
  var ActivityLogLocale = function() {
    return {
      root: {
        activityLogDetails: {
          labels: {
            header: "Activity Log ({count})",
            ACCOUNTS_FINANCIAL: "Accounts Financial",
            ACCOUNTS_NON_FINANCIAL: "Others",
            PAYMENTS: "Payments",
            BULK: "Bulk Files",
            BENEFICIARY: "Beneficiary",
            date: "Date",
            type: "Type",
            referenceNo: "Reference No",
            Beneficiary: "Beneficiary",
            initiatedBy: "Initiated by",
            status: "Status",
            accountsFinancial: "Accounts Financial",
            accountsNonFinancial: "Others",
            transactionType: "Transaction Type",
            accountNumber: "Account Number",
            accountName: "Account Name",
            amount: "Amount",
            fileName: "File Name",
            approvalType: "App Type",
            totalFileAmount: "Total File Amount",
            description: "Description"
          },
          transactionList: {
            PENDING_APPROVAL: "Pending Approval"
          }
        }
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
  return new ActivityLogLocale();
});
