define([], function() {
  "use strict";
  var corporateLimitsLogLocale = function() {
    return {
      root: {
        corporateLimitsDetails: {
          labels: {
            title: "Corporate Limits"
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
  return new corporateLimitsLogLocale();
});