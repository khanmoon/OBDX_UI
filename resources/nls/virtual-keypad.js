define([], function() {
  "use strict";
  var Locale = function() {
    return {
      root: {
        openKeyboard: "Open Virtual Keypad"

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
  return new Locale();
});
