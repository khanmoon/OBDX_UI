define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var pendingApprovalsLocale = function() {
    return {
      root: {
        pendingApprovalsDetails: {
          labels: {
            accountsFinancialList: "Table displaying account details",
            accountsNonFinancialList: "Table displaying account details",
            bulkFileList: "List of bulk Files",
            bulkRecordList: "List of Bulk Records",
            otherTransactionsList: "Other Transaction Details",
            payeeList: "Payee List Details",
            paymentList: "List of Payments",
            tradeFinanceList: "Trade list Details"
          }
        },
        generic: Generic,
        navBarDescription: "Pending Approvals"
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
  return new pendingApprovalsLocale();
});