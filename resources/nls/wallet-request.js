define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          request: {
            successMsg: "Your request has been sent successfully.",
            wallet_request_title: "Request",
            wallet_request_description: "From your contacts",
            pay_who_placeholder: "Enter Email Id/Mobile Number",
            request_who: "From",
            invalidrecipient: "Please provide recipient information",
            comment: "Comments",
            send_request: "Send Request",
            requesting: "From",
            review: "Review",
            validationsFailed: "Validations failed"
          }
        },
        common: {
          amount: "Amount",
          confirm: "Confirm",
          cancel: "Cancel"
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