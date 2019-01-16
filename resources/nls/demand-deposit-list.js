define([], function() {
  "use strict";
  var DemandDepositListLocale = function() {
    return {
      root: {
        cardDetails: {
          jointAccount: "Joint Account",
          netBalance: "Net Balance",
          islamic: "Islamic",
          conventional: "Conventional"
        },
        closeAccountList: "Inactive Account List",
        back: "Back"
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
  return new DemandDepositListLocale();
});