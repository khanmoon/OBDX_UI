define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var InternalAccessPoints = function() {
    return {
      root: {
        internalAccessPoints: {
          internalAccessPoints: "Touch Points",
          selectAccessPoints: "Select Touch Points",
          selectedAccessPoints: "Selected Touch Points"
        },

        generic: Generic
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
  return new InternalAccessPoints();
});
