define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewTermDepositTopUp = function() {
    return {
      root: {
        common: {
          review: "Review",
          reviewHeader: "You initiated a request for Deposit Top Up. Please review details before you confirm!"
        },
        transactions: {
          topUp: {
            topUp: "Top Up",
            sourceAccount: "Source Account",
            currentPrincipal: "Current Principal Amount",
            topUpAmount: "Top Up Amount",
            narration: "Narration",
            revisedPrincipal: "Revised Principal Amount",
            revisedMaturity: "Revised Maturity Amount",
            confirmation: "Confirmation",
            successfulTransaction: "Top Up Successful!",
            referenceNumber: "Reference Number {refNo}",
            reset: "Reset",
            review: "Review",
            cancel: "Cancel",
            confirm: "Confirm",
            done: "Done",
            revisedInterestRate: "Revised Interest Rate",
            transactionMessage: "Top Up successful for {amount}!",
            unitMessage: "Top Up should be in multiples of {unit}.",
            limitMessage: "Maximum Top Up should be {max}.",
            tdAccountNumber: "TD Account Number"
          }
        },
        confirmationMsg: {
          FINAL_LEVEL_APPROVED: "You have successfully approved the request.",
          MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval.",
          REJECT_BY_HOST: "Your request has been rejected.",
          REJECT: "You have rejected the request.",
          INITIATED: "Your request has been initiated successfully.",
          AUTO_AUTH: "Your request has been accepted."
        },
        generic: Generic
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
  return new ReviewTermDepositTopUp();
});
