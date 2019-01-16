define([], function() {
  "use strict";
  var Locale = function() {
    return {
      root: {
        branch: "Branch",
        confirm: "Confirm {label}",
        errorMessage: "Both account numbers should match"
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
