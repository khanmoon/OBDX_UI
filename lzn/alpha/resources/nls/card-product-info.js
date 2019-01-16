define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var cardProductInfoLocale = function() {
    return {
      root: {
        existingCustomer: "Already a customer banking online with us?",
        interestedButton: "I am Interested!",
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
  return new cardProductInfoLocale();
});