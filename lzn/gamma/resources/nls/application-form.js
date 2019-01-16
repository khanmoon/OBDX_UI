define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var depositRequirementsLocale = function() {
    return {
      root: {
        compName: "application-form",
        years: "Year(s)",
        months: "Month(s)",
        infoPrefilled: "We have pre-filled your existing information. (Click to View / Add)",
        continueInvalid: "Please enter information in unfilled sections.",
        continueInvalidAlert: "Please enter information in sections against which the icon <span class'icon-alert icon-error-message'></span> is displayed.",
        financialTemplate: {
          name: "Financial Profile {index}",
          financialProfile: "Financial Profile"
        },
        accordionLogo:"{accordionName} Logo",
        image:"{accordionLogo} Logo",
        generic: Generic,
        personalDetails:{
          iconClick:"minimize"
        }
      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new depositRequirementsLocale();
});
