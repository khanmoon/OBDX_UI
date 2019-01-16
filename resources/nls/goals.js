define([], function() {
  "use strict";
  var toolCalcLocale = function() {
    return {
      root: {
        header: "Achieve your Dream with us",
        quote: "“All your dreams can come true,<br> if we have the courage to pursue them”",
        author: "Walt Disney",
        proceed: "Proceed"
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
  return new toolCalcLocale();
});