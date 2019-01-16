define([], function() {
  "use strict";
  var setPin = function() {
    return {
      root: {
        enterPin: "Enter Pin",
        close: "Close pin login",
        closeAlt: "Click here to close pin login",
        maximumRetrysExceeded: "Maximum number of attempts have been exceeded",
        invalidPin: "Invalid Pin",
        loading: "Please wait for the request to complete"
        //'loading':'loading - please wait'
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
