define([], function() {
  "use strict";
  var FinancialPositionLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            termDepositsText: "Term Deposits",
            demandDepositsText: "Current & Savings",
            demandDepositsOD: "Current & Savings Over Draft",
            loansText: "Loans and Finances",
            title: "Financial Overview",
            termDeposits: "Term Deposits ({amount})",
            demandDeposits: "Savings & Current Accounts ({amount})",
            assets: "Assets",
            loans: "Loans ({amount})",
            creditCards: "Credit Cards",
            liabilities: "Liabilities",
            netWorth: "Net Worth",
            accountType: "Account Type",
            amount: "Amount",
            pieSliceLabel: "{currency}",
            all: "All Parties",
            partyDropDown: "Currently displaying data for",
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
  return new FinancialPositionLocale();
});
