define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/account-activity"
], function(Generic, Activity) {
  "use strict";
  var ServiceRequestList = function() {
    return {
      root: {
        serviceRequest: {
          header: "Service Request",
          date: "Date",
          refNo: "Reference Number",
          billDate: "Bill Date",
          PE: "Pending",
          noteReview: "Note",
          back: "Back",

          description: {
            description: "Description",
            CREDIT_CARD_HOTLISTING: "Credit Card Hotlisting",
            CREDIT_CARD_SUPPLIMENTARY: "Credit Card Supplementary",
            CREDIT_CARD_SET_CREDENTIAL: "Credit Card Set Credential",
            UPDATE_CARD_LIMIT: "Update Card Limit",
            REPLACE_CARD: "Replace Card",
            CREDIT_CARD_STATEMENT_DISPUTE: "Credit Card Statement Dispute",
            UPDATE_BILL_CYCLE: "Update Bill Cycle",
            UPDATE_AUTO_REPAYMENT: "Update Auto Repayment",
            REGISTER_AUTO_REPAYMENT: "Register Auto Repayment",
            DEREGISTER_AUTO_REPAYMENT: "Deregister Auto Repayment",
            ACTIVATE_CARD: "Activate Card",
            DEACTIVATE_CARD: "Deactivate Card",
            HOTLIST_CARD: "Hotlist Card",
            CANCEL_CARD: "Cancel Card",
            DEBIT_CARD_PIN: "Debit Card Pin",
            APPLY_DEBIT_CARD: "Apply Debit Card",
            LOAN_TOP_UP: "Loan Top Up",
            ACTIVATE_DEBIT_CARD: "Activate Debit Card",
            REPLACE_DEBIT_CARD: "Replace Debit Card"
          },
          status: {
            status: "Status",
            PE: "Pending",
            CO: "Complete",
            CA: "Cancel"
          }
        },
        generic: Generic,
        accountActivity: Activity
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ServiceRequestList();
});