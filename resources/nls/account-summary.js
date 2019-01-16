define(["ojL10n!resources/nls/origination-generic"], function(Generic) {
  "use strict";
  var AccountSummary = function() {
    return {
      root: {
        pageTitle: {
          accountSummaryTitle: "Account Summary ({accounts})"
        },
        accountSummary: {
          accountNo: "Account Number",
          accountName: "Account Name",
          partyName: "Party Name",
          accountType: "Account Type",
          currency: "Currency",
          netBalance: "Net Balance",
          netBalanceLabel: "Bal",
          accountSummaryLabel: "Showing {showedAccounts} of {totalAccounts}",
          accountSummary: "Accounts Summary",
          linkDetails: "Click to see details of {account}",
          linkDetailsText: "{account} Details",
          displayContent: "{nickname}",
          download: "Download",
          downloadText: "Click to download Account Summary",
          conventionalAccount: "Conventional",
          islamicAccount: "Islamic",
          myAccountType: "Type Of Account Held",
          status:"Status"
        },
        generic: Generic
      },
      ar:true,
      fr:true,
      cs:true,
      sv:true,
      en:false,
      "en-us":false,
      el:true};
  };
  return new AccountSummary();
});
