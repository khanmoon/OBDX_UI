define([], function() {
  "use strict";
  var LocationSearchLocale = function() {
    return {
      root: {
        pageTitle: {

        },
        fieldname: {
          selectHost: "Select Host"

        },
        headings: {
          systemConfigureHeading: "System Configuration",
          welcome: "Welcome to System Setting Configuration",
          //'SystemConf':'System Setting Configuration',
          p1: "This wizard gives you a quick and easy method to configure the System.",
          p2: "Just keep clicking Next until you finish."
        },
        buttons: {
          cancel: "Cancel",
          clear: "Clear",
          add: "Add",
          getStarted: "Get Started"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationSearchLocale();
});