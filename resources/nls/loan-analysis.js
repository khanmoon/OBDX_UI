define([], function() {
  "use strict";
  var LoanAnalysisModel = function() {
    return {
      root: {
        accountType: {
          CON: "Conventional",
          ISL: "Islamic"
        },
        accountCount: "{count} Accounts",
        buttonsetBinding: "<span class=\"count\">{count}</span><span>{label}</span>",
        analysis: {
          summary: "Loans",
          totalBorrow: "Total Borrowing",
          currentOutstanding: "Current Outstanding",
          noData: "Relax! You do not have any loan to pay.",
          bottomText: "Looking for a new loan?",
          selectOption: "Choose only one option"
        }
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
  return new LoanAnalysisModel();
});