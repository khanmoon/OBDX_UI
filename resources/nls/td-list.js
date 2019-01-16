define([], function() {
  "use strict";
  var TermDepositList = function() {
    return {
      root: {
        cardDetails: {
          currentBalance: "Current Balance",
          jointAccount: "Joint Account",
          maturity: "Maturity",
          interestRate: "@{rate} | Maturing {maturityDate}",
          closedDeposit: "Closed Deposits",
          islamic: "Islamic",
          conventional: "Conventional"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new TermDepositList();
});