define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var dashboardLocale = function() {
    return {
      root: {

        return: "Return to Tracker",
        cancelApplication: "Cancel Application",
        cancelApplicationModelHeading: "Are you sure you want to cancel your application?",
        cancelApplicationModelMessage: "Your application will be permanently deleted and you will not be able to retrieve it once it has been cancelled.",
        cancelApplicationSuccessMessage: "Your {productType} application has been cancelled",
        headingText: "Application Dashboard",
        no: "No",
        yes: "Yes",

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