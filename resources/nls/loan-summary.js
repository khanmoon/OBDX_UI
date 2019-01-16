define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var LoanAccountSummary = function() {
    return {
      root: {
        pageTitle: {
          title: "Loans",
          loanSummaryTitle: "Loan and Finances Summary"
        },
        accountSummary: {
          accountNo: "Account Number",
          accountName: "Account Name",
          maturityDate: "Maturity Date",
          interestRate: "Interest Rate",
          profitRate: "Profit Rate",
          currency: "Currency",
          partyName: "Party Name",
          outstandingBalance: "Outstanding Balance",
          interestRateIcon: "@ {interestRate}",
          accountSummaryLabel: "Showing {showedAccounts} of {totalAccounts}",
          accountSummary: "Loan Accounts Summary",
          depositRateAndMaturityDate: "@ {interestRate} | Maturing on {maturityDate}",
          linkDetails: "Click to see details of {accountNo}",
          linkDetailsText: "{accountNo} Details",
          displayContent: "{nickname}",
          download: "Download",
          downloadText: "Click to download Account Summary",
          conventionalAccount: "Conventional",
          islamicAccount: "Islamic",
          myAccountType: "Type Of Account Held"
        },
        generic: Generic
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
  return new LoanAccountSummary();
});
