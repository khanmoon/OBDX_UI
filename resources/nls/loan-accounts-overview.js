define([], function() {
  "use strict";
  var LoanAccountOverviewLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            loansOverview: "Loan and Finances Overview",
            currency: "Currency",
            totalBorrowing: "Total Borrowing  ({amount})",
            currentOutstanding: "Current Outstanding  ({amount})",
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
