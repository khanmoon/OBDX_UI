define([], function() {
  "use strict";
  var TDActionCardCallLocale = function() {
    return {
      root: {
        termDeposit: {
          newDeposit: {
            title: "New Deposit",
            description: "Apply for New Term Deposits",
            imgDesc: "New Deposit"
          },
          calculator: {
            title: "Deposit Calculator",

            imgDesc: "Calculate Deposit"
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
  return new TDActionCardCallLocale();
});