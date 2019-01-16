define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var loanAccountPreferenceLocale = function() {
    return {
      root: {
        cardTitle: "Account Preferences",
        accountPreference: "Account Preference",
        frequencyForStatement: "Statement Frequency",
        availRedrawFacility: "Avail Redraw Facility",

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
  return new loanAccountPreferenceLocale();
});