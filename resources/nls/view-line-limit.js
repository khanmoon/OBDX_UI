define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/trade-finance-errors"], function(Generic, tradeFinanceErrors) {
  "use strict";
  var ViewLineLimitLocale = function() {
    return {
      root: {
        generic: Generic,
        tradeFinanceErrors: tradeFinanceErrors,
        heading: {
          lineLimit: "Line Limits Utilization"
        },
        labels: {
          liababilityId: "Liability ID",
          customerName: "Customer Name",
          lineId: "Line ID",
          lineLimit: "Line Limit",
          referenceNo: "Reference No",
          customerId: "Customer ID",
          transactionName: "Product Name",
          maturityDate: "Maturity Date",
          currency: "Currency",
          amountUtilized: "Amount Utilized",
          lineLimits: "Sub Line Limits Table",
          amountUtilizedCcy: "Amount Utilized in Line Currency",
          lineCurrency: "Line Currency"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new ViewLineLimitLocale();
});