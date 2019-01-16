define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var LoanDisbursementModel = function() {
    return {
      root: {
        disbursement: {
          disbursementDetails: "Disbursement Inquiry",
          sanctionedAmount: "Sanctioned Amount",
          disbursedAmount: "Disbursed Amount",
          FinAmount: "Financed Amount",
          finDisbursedAmount: "Financed Amount Disbursed",
          disbursementDate: "Date",
          amount: "Amount",
          selectAccount: "Select Account",
          tableLabel: "Loan Disbursement Table"
        },
        generic: Generic
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new LoanDisbursementModel();
});