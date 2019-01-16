define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var cardAdditionalPreferencesLocale = function() {
    return {
      root: {
        returnToTracker: "Return to Tracker",
        back: "Back",
        fillAdditional: "Please provide additional details for your application",
        additionalInfo: "Additional Information",
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
  return new cardAdditionalPreferencesLocale();
});