define([], function() {
  "use strict";
  var deviceUnbinding = function() {
    return {
      root: {
        feedbackPreferences : "Feedback Preferences",
        Note:"Note : Disabling this will disable the feedback popup after every transaction.",
        settings : "Settings"
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new deviceUnbinding();
});
