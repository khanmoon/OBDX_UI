define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          add: {
            comment: "Comments",
            addFunds: "Add Funds",
            validationsFailed: "Validations failed"
          }
        },
        common: {
          confirm: "Confirm",
          amount: "Amount",
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