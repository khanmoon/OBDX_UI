define([], function() {
  "use strict";
  var MenuLocale = function() {
    return {
      root: {
        widgetHeading: "Trade Finance",
        tradeFinanceLinks: {
          clickHere: "Click for {name}",
          default: {
            "letter-of-credit": "Letter Of Credit",
            "bank-guarantee": "Bank Guarantee",
            "bill-payments": "Bill Payments",
            "bill-acceptance": "Bill Acceptance"
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
  return new MenuLocale();
});
