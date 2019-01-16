define([], function() {
  "use strict";
  var LoanAccountOverviewLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            loanPortfolio: "Loan and Finances Portfolio",
            noData: "No data to display",
            conventionalAccount: "Conventional",
            islamicAccount: "Islamic",
            myAccountType: "Type Of Account Held"
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
  return new LoanAccountOverviewLocale();
});
