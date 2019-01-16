define([], function() {
  "use strict";
  var toolCalcLocale = function() {
    return {
      root: {
        toolCalc: {
          labels: {
            toolHeading: "Tools & Calculator"
          },
          blueTxt: {
            loan: "Loans",
            termDeposit: "Term  Deposits",
            eligibility: "Eligibility",
            FECalculator: "Foreign Exchange"
          },
          whiteTxt: {
            calculator: "Calculator",
            calculators: "Calculators"
          },
          tcdescription: {
            loan: "Getting home loan from ZigBank is quick and easy.",
            termDeposit: "Our term deposit calculator helps you determine savings.",
            eligibility: "Eligibility Calculator to calculate the amount you borrow.",
            FECalculator: "A Personal Forex Ex-change Service from a Pro-Active Team."

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
  return new toolCalcLocale();
});