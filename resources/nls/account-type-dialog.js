define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          payee: {
            whichaccount: "What type of payee would you like to add?",
            bankaccount: "Bank Account",
            bankAccountAlt: "Click to Open a bank account",
            demanddraft: "Demand Draft",
            demanddraftAlt: "Click to add a demand draft",
            addnew: "Add New Payee"
          },
          common: {
            ok: "Ok"
          },
          messages: Messages,
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