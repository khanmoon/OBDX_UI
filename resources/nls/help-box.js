define([], function() {
  "use strict";
  var HelpBoxLocale = function() {
    return {
      root: {
        data: {
          txt1: "Explanation 1",
          txt2: "Explanation 2",
          txt3: "Explanation 3"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new HelpBoxLocale();
});