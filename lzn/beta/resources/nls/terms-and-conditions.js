define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var customizeCardLocale = function() {
    return {
      root: {
        termsAndConds: "Terms and Conditions",
        info: "Please go through the following terms and conditions carefully so that you are fully aware about the terms of this credit card offer.",
        certCheckbox: "I have read and agree to the above terms and conditions.",
        generic: Generic

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
  return new customizeCardLocale();
});