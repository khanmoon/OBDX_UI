define([], function() {
  "use strict";
  var DemandDepositAnalysisLocale = function() {
    return {
      root: {
        accountType: {
          conventional: "Conventional",
          islamic: "Islamic"
        },
        accountCount: "{count} Accounts",
        buttonsetBinding: "<span class=\"count\">{count}</span><span>{label}</span>",
        analysis: {
          title: "Savings & Current",
          summary: "Summary",
          balance_heading_main: "Total Net Balance",
          description: "Accounts",
          iOwe: "I Owe",
          accountNo: "Account No",
          amount: "Amount",
          tableheader: "Graphical Representation of data",
          selectOption: "Choose Only One Option",
          noData: "You do not have any savings or current account with us.",
          bottomText: "Open a new Saving Account?"
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
  return new DemandDepositAnalysisLocale();
});