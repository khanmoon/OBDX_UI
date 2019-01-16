define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var MultipleBillPaymentsLocale = function() {
    return {
      root: {
        label: {
          bill: "Bill {count}"
        },
        link: {
          addpayment: "Add Another Payment"
        },
        msg: {
          maxPaymentCountLimitMsg: "The limit for maximum number of payments has been met. You are eligible to initiate up to {count} payments through Multiple Bill Payments.",
          unsavedTransactionMsg1: "You have {count} unsaved transaction/s. Unsaved transactions will not be submitted and the data will be lost.",
          unsavedTransactionMsg2: "Are you sure you want to proceed?",
          atleastonetxnmsg: "At least one transaction must be saved to proceed."

        },
        title: {
          warning: "Warning",
          header: "Multiple Bill Payments"
        },
        generic: Generic.common

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
  return new MultipleBillPaymentsLocale();
});