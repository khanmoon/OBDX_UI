define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewChequeBookRequest = function() {
    return {
      root: {
        common: {
          review: "Review",
          reviewHeader: "You initiated a request for Loan Repayment. Please review details before you confirm!"
        },
        loanRepayment: {
          transferFrom: "Transfer From",
          amount: "Repayment Amount",
          principalBalance: "Outstanding Principal",
          installmentArrears: "Pending Arrears",
          loanAccountNumber: "Loan Account Number"
        },
        confirmationMsg: {
          FINAL_LEVEL_APPROVED: "You have successfully approved the request.",
          MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval.",
          REJECT_BY_HOST: "Your request has been rejected.",
          REJECT: "You have rejected the request.",
          INITIATED: "Your request has been initiated successfully.",
          AUTO_AUTH: "Your transaction is successful."
        },
        generic: Generic,
        header: "Repayment"
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
  return new ReviewChequeBookRequest();
});
