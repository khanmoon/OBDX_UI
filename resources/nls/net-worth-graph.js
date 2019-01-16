define([], function() {
  "use strict";
  var netWorthGraph = function() {
    return {
      root: {
        myNetworth: "My Net Worth",
        networth: "Net Worth",
        netAssetValue: "Net Assets",
        last90Days: "My Net worth : Last 90 Days",
        myNetworthLabel : "Choose the networth category",
        cash: "Cash",
        debt: "Debt",
        on: "on {date}",
        onceYourTransaction: "Once your transaction begins your graph will appear here!",
        iHave: "I Have",
        iOwe: "I Owe",
        labels: {
          CSA: "Current & Savings",
          TRD: "Term Deposit",
          LON: "Loans",
          CCA: "Credit Card",
          CSAOD: "Current & Savings-OD",
          RD: "Recurring Deposit"
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
  return new netWorthGraph();
});
