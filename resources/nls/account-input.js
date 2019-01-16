define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var AccountInputLocale = function() {
    return {
      root: {
        balanceNholding: "Balance : {balance}",
        noAccounts: "No Account(s) available",
        selectAccount: "Select Account",
        accountSelected: "Account Number",
        accountLabel: "Source Account",
        displayContent: "{displayValue} - {nickname}",
        optGroup: "{id} — {name}",
        CON: "Conventional Account",
        ISL: "Islamic Account",
        RD: "Recurring Deposit",
        txnNotAvailable: "This facility is not available for the selected account.",
        noActiveAccounts : "No active accounts available",
        holdingPatternType:{
          SINGLE: "Single",
          JOINT: "Joint"
        },
        generic: Generic
      },
      ar:false,
      fr:true,
      cs:false,
      sv:false,
      en:false,
      "en-us":false,
      el:false};
  };
  return new AccountInputLocale();
});
