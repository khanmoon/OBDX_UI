define([], function() {
  "use strict";
  var MultiplePaymentsStatusLocale = function() {
    return {
      root: {
        header: "Multiple Transfers Status",
        headerSmall: "Status",
        label: {
          payee: "Payee",
          fromaccount: "From Account",
          amount: "Amount",
          datenamount: "Date & Amount",
          date: "Date",
          refno: "Reference No.",
          hostrefno: "Host Reference No.",
          status: "Status",
          action: "Action",
          caption: "Multiple transfers status table",
          na: "NA",
          failureReason: "Failure Reason"
        },
        action: {
          backToDashboard: "Back to Dashboard",
          eReceipt: "e-Receipt",
          downloadAllEreceipts: "Download all e-Receipts"
        },
        status: {
          200: "Completed",
          202: "Initiated",
          error: "Failed"
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
  return new MultiplePaymentsStatusLocale();
});