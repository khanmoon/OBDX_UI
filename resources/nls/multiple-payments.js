define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var MultiplePaymentsLocale = function() {
    return {
      root: {
        label: {
          payee: "Payee {count}"
        },
        link: {
          addpayment: "Add Another Payment"
        },
        msg: {
          maxPaymentCountLimitMsg: "The limit for maximum number of transfers has been met. You are eligible to initiate up to {count} transfers through Multiple Transfers.",
          unsavedTransactionMsg1: "You have {count} unsaved transaction/s. Unsaved transactions will not be submitted and the data will be lost.",
          unsavedTransactionMsg2: "Are you sure you want to proceed?",
          atleastonetxnmsg: "At least one transaction must be saved to proceed.",
          upcomingPaymentMsg : "You already have a payment instruction/s set up for this payee due within the next {days} days."
        },
        title: {
          warning: "Warning",
          header: "Multiple Transfers"
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
  return new MultiplePaymentsLocale();
});