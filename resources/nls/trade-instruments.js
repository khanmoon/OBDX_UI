define([], function() {
  "use strict";
  var TradeInstrumentsLogLocale = function() {
    return {
      root: {
        tempradeInstrumentsDetails: {
          labels: {
            title: "Trade Instruments",
            importLC: "Import LC",
            totalAmount: "Total Amount",
            exportLC: "Export LC",
            outwardGuarantee: "Outward Guarantee",
            expiryTen: "Expiry in 10 days",
            expiryFifteen: "Expiry in 15 days",
            expiryThirty: "Expiry in 30 days",
            dateDropDown: "Select the expiry duration",
            tradeList: "Trade details list",
            specificTradeInfo: "Trade List Information",
            noData: "No data to display"
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
  return new TradeInstrumentsLogLocale();
});
