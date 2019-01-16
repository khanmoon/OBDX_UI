define([], function() {
  "use strict";
  var setPin = function() {
    return {
      root: {
        pin: "Pin",
        pattern: "Pattern",
        touchID: "Touch ID",
        faceID: "Face ID",
        selectLoginMethod: "Select Login Method",
        proceed: "Proceed",
        cancel: "Cancel",
        doYouWishTosetupAltenateLogin: "Do you wish to setup Alternate Login?"
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
