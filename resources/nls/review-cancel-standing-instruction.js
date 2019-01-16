define([
  "ojL10n!resources/nls/payments-common"
], function(Common) {
  "use strict";
  var ReviewInstructionCancellation = function() {
    return {
      root: {
        paymentDetails: {
          cancelHeader: "Cancel Transfer",
          transferto: "Transfer To",
          amount: "Amount",
          transferon: "Transfer When",
          frequency: "Transfer Frequency",
          startTransfer: "Start Transferring",
          stopTransfer: "Stop Transferring",
          transferfrom: "Transfer From",
          purpose: "Purpose",
          note: "Note",
          correspondencecharges: "Correspondence Charges",
          paymentdetails: "Payment Details",
          instances: "Instances",
          reviewHeaderMsg: "You initiated a request for cancellation of Standing Instruction. Please review details before you confirm!"
        },
        common: Common.payments.common
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
  return new ReviewInstructionCancellation();
});