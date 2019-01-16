define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Generic, Common) {
  "use strict";
  var ReviewPaymentSelf = function() {
    return {
      root: {
        paymentDetails: {
          header: "Self Transfer Details",
          transferto: "Transfer To",
          transferon: "Transfer When",
          amount: "Amount",
          frequency: "Transfer Frequency",
          startTransfer: "Start Transferring",
          stopTransfer: "Stop Transferring",
          transferfrom: "Transfer From",
          note: "Note",
          "instances-2": "instances",
          reviewHeaderMsg: "You initiated a request for Self Transfer. Please review details before you confirm!",
          dealNumber: "Deal Number",
          spot: "Spot",
          forward: "Forward",
          dealType: "Deal Type",
          exchangeRate: "Exchange Rate"
        },
        common: Common.payments.common,
        frequency: {
          20: "Every day",
          30: "Every 7 days",
          40: "Every 15 days",
          50: "Every month",
          60: "Every 2 months",
          70: "Every 3 months",
          80: "Every 6 months",
          90: "Every year"
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
  return new ReviewPaymentSelf();
});