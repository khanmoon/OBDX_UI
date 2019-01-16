define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var cardFeesChargesLocale = function() {
    return {
      root: {
        applicationFees: "Application Fees",

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
  return new cardFeesChargesLocale();
});