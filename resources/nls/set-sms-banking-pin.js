define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var setPin = function() {
    return {
      root: {
        setPin: "Set Pin",
        pinOptions: "Pin Options",
        proceed: "Proceed",
        confirmPin: "Confirm Pin",
        setResetPin:"Set/Reset Pin",
        pinDidntMatch: "Pin did not Match",
        couldntSetupPin: "Unable to set pin.",
        pinSuccessfullySetup : "Pin has been successfully setup",
        numberMsg:"The pin should be a 4 digit number",
        header:"SMS and Missed Call Banking",
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
  return new setPin();
});
