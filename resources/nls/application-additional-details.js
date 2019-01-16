define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var dashboardLocale = function() {
    return {
      root: {
        fillAdditional: "Please provide additional details for your application",
        return: "Return to Tracker",
        back: "Back",
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
  return new dashboardLocale();
});