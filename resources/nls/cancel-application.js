define([], function() {
  "use strict";
  var cancleApplicationLocale = function() {
    return {
      root: {
        cancelApplication: "Cancel Application",
        cancelReason: "What is the reason for cancelling ?",
        plSpecify: "Please Specify",
        infoIcon: "Your information will not be saved, and you will have to start a new application later.",
        cancelExit: "Cancel and Exit",
        defaultCancelText: "Your application has been cancelled.",
        cancelText: "Your {offerName} application has been cancelled.",
        returnApplication: "Return to Application",
        homepage: "Go to Homepage"
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
  return new cancleApplicationLocale();
});