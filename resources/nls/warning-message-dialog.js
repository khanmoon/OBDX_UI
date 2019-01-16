define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          payee: {
            cancelConfirm: "Are you sure you want to cancel the operation?",
            yes: "Yes",
            no: "No"
          },
          generic: Generic
        }
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