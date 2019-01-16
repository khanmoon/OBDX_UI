define([], function() {
  "use strict";
  var contactUsLocale = function() {
    return {
      root: {
        contactUs: {
          labels: {
            title: "Get in Touch With Us",
            locateATM: "Locate ATM / Branch",
            expertSuggestion: "Talk to an Expert",
            contactInfo: "1800 200 300 400"
          }

        }
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
  return new contactUsLocale();
});