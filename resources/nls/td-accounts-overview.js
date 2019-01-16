define([], function() {
  "use strict";
  var TermDepositAccountOverviewLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            tdOverview: "TD Accounts Overview",
            investments: "Investment ({amount})",
            currentBalance: "Current Balance ({amount})",
            maturityAmount: "Maturity Amount ({amount})",
            title: "Term Deposits",
            header: "Current Position",
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
  return new TermDepositAccountOverviewLocale();
});
