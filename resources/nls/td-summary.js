define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var TermDepositsSummary = function() {
    return {
      root: {
        pageTitle: {
          title: "Term Deposits",
          tdSummaryTitle: "Term Deposit Summary"
        },
        depositsSummary: {
          accountNo: "Account Number",
          depositNo: "Deposit Number",
          currency: "Currency",
          partyName: "Party Name",
          principalBalance: "Principal Balance",
          interestRate: "Interest Rate",
          profitRate: "Profit Rate",
          maturityDate: "Maturity Date",
          currentBalance: "Current Balance",
          maturityBalance: "Maturity Balance",
          depositRateAndMaturityDate: "@ {interestRate} | Maturing on {maturityDate}",
          depositsSummary: "TD Accounts Summary",
          accountSummaryLabel: "Showing {showedAccounts} of {totalAccounts}",
          summaryDetails: "Term Deposit Account Summary",
          download: "Download",
          downloadText: "Click to download Account Summary"
        },
        accountSummary: {
          linkDetails: "Click to see details of {accountNo}",
          linkDetailsText: "{accountNo} Details",
          displayContent: "{nickname}",
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
  return new TermDepositsSummary();
});
