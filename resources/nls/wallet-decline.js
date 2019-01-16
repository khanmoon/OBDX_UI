define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          decline: {
            header: "Decline",
            successMsg: "Your request has been sent successfully.",
            decline: "Do you really want to decline this request?"
          }
        },
        common: {
          yes: "Yes",
          no: "No"
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