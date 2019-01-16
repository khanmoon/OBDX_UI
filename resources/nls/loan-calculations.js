define([], function() {
  "use strict";
  var LoansLocale = function() {
    return {
      root: {
        loanCalculator: "Loan Calculator",
        loanEligibility: "Loan Eligibility",
        navBarDescription: "Navigation Bar to select action"
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
  return new LoansLocale();
});