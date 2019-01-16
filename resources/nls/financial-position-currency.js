define([], function() {
  "use strict";
  var LoanAccountOverviewLocale = function() {
    return {
      root: {
        financialPositionDetails: {
          labels: {
            financialPositionCurrency: "Position By Currency",
            type: "Type",
            assetsLabel: "Assets",
            liabilityLabel: "Liabilties",
            currency: "Currency",
            partyDropDown: "Currently displaying data for",
            all: "All Parties",
            conventionalAccount: "Conventional",
            islamicAccount: "Islamic",
            myAccountType: "Type Of Account Held",
            tooltip: {
              series: "Series : {series}",
              group: "Group : {group}",
              value: "Value : {value}"
            }
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
  return new LoanAccountOverviewLocale();
});
