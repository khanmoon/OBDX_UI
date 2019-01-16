define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/trade-finance-common", "ojL10n!resources/nls/trade-finance-errors", "ojL10n!resources/nls/view-bills", "ojL10n!resources/nls/view-letter-of-credit"], function(Generic, TradeFinanceCommon, TradeFinanceErrors, ViewBills, ViewLC) {
  "use strict";
  var DiscrepanciesLocale = function() {
    return {
      root: {

        heading: {
          billDiscrepancies: "Bill Discrepancies",
          discrepancyDetails: "Discrepancy Details",
          customerAcceptance: "Customer Acceptance",
          billTables: "Searched List for Bill Discrepancies"
        },
        navLabels: {
          discrepancies: "Bill Discrepancies",
          amendment: "Export LC Amendment",
          navBarDescription: "Navigation Bar for Customer Acceptance",
          acceptance: "Acceptance for"
        },
        labels: {
          productName: "Product Name",
          beneficiary: "Beneficiary",
          notes: "Notes",
          resolution: "Resolution",
          accept: "Accept",
          reject: "Reject",
          notresolved: "Not resolved yet",
          srNo: "Sr No.",
          billNumber: "Bill No. {billNumber} - Discrepancy Details",
          customerAcceptanceInitiation: "Customer Acceptance",
          lcNumber: "LC Number {lcNumber}",
          LCNumber: "LC Number",
          amendmentNumber: "Amendment Number {amendmentNumber}"
        },
        viewLC: ViewLC,
        button: {
          initiate: "Initiate"
        },

        generic: Generic,
        common: TradeFinanceCommon,
        tradeFinanceErrors: TradeFinanceErrors,
        viewBills: ViewBills

      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new DiscrepanciesLocale();
});
