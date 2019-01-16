define([], function() {
  "use strict";
  var ApproverLocale = function() {
    return {
      root: {
        pageTitle: {
          approver: "Approver"
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
  return new ApproverLocale();
});