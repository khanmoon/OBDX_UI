define([], function() {
  "use strict";
  var TermDepositAnalysis = function() {
    return {
      root: {
        accountType: {
          conventional: "Conventional",
          islamic: "Islamic"
        },
        accountCount: "{count} Accounts",
        buttonsetBinding: "<span class=\"count\">{count}</span><span>{label}</span>",
        TDanalysis: {
          analysis: "Term Deposits",
          totalCurrentBal: "Total Current Balance",
          totalInvestment: "Total Investment",
          maturityAmount: "Total Maturity Amount",
          noData: "You do not have any deposits with us.",
          bottomText: "Open a new TD Account?",
          selectOption: "Choose Only One Option"
        }
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
  return new TermDepositAnalysis();
});