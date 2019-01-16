define([], function() {
  "use strict";
  var MultipleBillPaymentsStatusLocale = function() {
    return {
      root: {
        header: "Multiple Bill Payment Status",
        headerSmall: "Status",
        label: {
          biller: "Biller",
          billerRelation: "Biller - Relationship",
          relationship: "Relationship No.",
          amount: "Amount",
          fromAccount: "From Account",
          dateAmount: "Date & Amount",
          failureReason: "Failure Reason",
          billNumber: "Bill Number",
          billDate: "Bill Date",
          refno: "Reference No.",
          hostrefno: "Host Reference No.",
          status: "Status",
          action: "Action",
          na: "NA",
          caption: "Table for Multiple Bill Payment status"

        },
        action: {
          backToDashboard: "Back to Dashboard",
          eReceipt: "eReceipt",
          downloadAllEreceipts: "Download all e-Receipts"

        },
        status: {
          200: "Completed",
          202: "Initiated",
          error: "Error"
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
  return new MultipleBillPaymentsStatusLocale();
});