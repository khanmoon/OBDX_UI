define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ConsolidatedAnalysisLocale = function() {
    return {
      root: {
        dashboard: {
          iHave: "I Have",
          iOwe: "I Owe",
          "demand-deposits": "Savings & Current",
          "term-deposits": "Term Deposits",
          loans: "Loans",
          "credit-cards": "Credit Cards",
          financialSummary: "Financial Summary",
          overview: "Overview",
          accountType: "Account Type",
          amount: "Amount"
        },
        generic: Generic
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ConsolidatedAnalysisLocale();
});