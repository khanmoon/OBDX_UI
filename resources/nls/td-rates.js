define([], function() {
  "use strict";
  var TermDepositRatesLocale = function() {
    return {
      root: {
        termDepositRates: {
          labels: {
            tdRatesHeader: "TD Rates",
            amount: "Amount",
            period: "Period",
            interestRate: "Interest Rate",
            details: "Term Deposit Rate List"
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
  return new TermDepositRatesLocale();
});