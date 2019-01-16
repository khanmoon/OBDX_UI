define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ChequeStatusInquiry = function() {
    return {
      root: {
        compName: {
          compName: "Cheque Status Inquiry"
        },
        chequeStatusInquiry: {
          selectAccount: "Select Account",
          number: "Number",
          range: "Range",
          status: "Status",
          reason: "Reason",
          chequeNumber: "Cheque Number",
          searchByCheque: "Search Cheque by",
          selectStatus: "Select Status",
          placeholder: "Please Select",
          amount: "Amount",
          unblock: "Unblock",
          from: "From",
          to: "To",
          fromDate: "From Date",
          toDate: "To Date",
          statusType: {
            U: "Used",
            N: "Not Used",
            S: "Stopped",
            R: "Rejected",
            C: "Cancelled"
          },
          transactionName: "Cheque Status inquiry"
        },
        generic: Generic
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
  return new ChequeStatusInquiry();
});