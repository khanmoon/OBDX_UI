define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ConfirmPin = function() {
    return {
      root: {
        confirmPin: "Confirm Pin",
        proceed: "Proceed",
        pinDidntMatch: "Pin did not Match",
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
  return new ConfirmPin();
});