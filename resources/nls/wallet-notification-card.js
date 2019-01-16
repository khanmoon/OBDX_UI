define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          notification: {
            insufficientfund: "Insufficient funds to honor the transaction.",
            header: "Pay",
            noComment: "has requested",
            pay: "Pay",
            decline: "Decline",
            balance: "Balance"
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
      el: true
    };
  };
  return new TransactionLocale();
});