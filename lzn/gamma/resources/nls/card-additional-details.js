define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var customizeCardLocale = function() {
    return {
      root: {
        compName: "card-additional-details",
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