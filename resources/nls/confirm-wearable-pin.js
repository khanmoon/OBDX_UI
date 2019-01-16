define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ConfirmPin = function() {
    return {
      root: {
        confirmPin: "Confirm Pin",
        proceed: "Proceed",
        pinDidntMatch: "Pin did not Match",
        pleaseAllow:"Permission to store the wearable device Id. If you want to permit it then press proceed or press cancel.",
        numberMsg : "Invalid Input",
        pinShouldhaveOnlyNumber:"A pin should have only numbers.",
        error:{
          MULTIPLE_WATCHES_CONNECTED:"You have connected multiple watches. Please connect only one and continue.",
          WATCH_NOT_CONNECTED:"You have not connected any watches. Please connect one and continue.",
          APP_NOT_FOUND:"Application not found in the watch connected."
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
  return new ConfirmPin();
});
