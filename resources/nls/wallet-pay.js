define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          pay: {
            referenceNum: "Reference Number is {refnumber}",
            pay_who: "Pay Who",
            pay_who_placeholder: "Enter Email Id / Mobile Number",
            comment: "Comments",
            pay_now: "Pay",
            paying: "Pay Who",
            header: "Pay",
            invalidrecipient: "Please provide recipient information",
            validationsFailed: "Validations failed"
          }
        },
        common: {
          confirm: "Confirm",
          cancel: "Cancel",
          amount: "Amount"
        },
        generic: Generic
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
  return new TransactionLocale();
});