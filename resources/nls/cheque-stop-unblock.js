define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ChequeStopUnblock = function() {
    return {
      root: {
        compName: {
          compName: "Stop/Unblock Cheque"
        },
        stopUnblockCheque: {
          actionToBePerformed: "Select Action",
          actionOnly: "Action",
          action: "Select Action",
          reviewHeading: "Review",
          selectAccount: "Select Account Number",
          unblockChequeConfirm: "Your request to unblock cheque number {chequeNo} has been submitted",
          referenceNumber: "Reference Number is {refNo}",
          transactionName: "Cheque Stop unblock",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected",
          common: {
            stop: "Stop",
            unblock: "Unblock",
            reason: "Specify Reason",
            successful: "Successful"
          }
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
  return new ChequeStopUnblock();
});