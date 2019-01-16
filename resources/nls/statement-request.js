define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var StatementRequestModel = function() {
    return {
      root: {
        statementRequest: {
          selectAccount: "Select Account Number",
          fromDate: "From Date",
          toDate: "To Date",
          account: "Account Number",
          title: "Request Statement",
          review: "Review",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected",
          hostReferenceNo: "Host Reference Number : {hostReferenceNo}"
        },
        common: {
          successful: "Successful!"
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
  return new StatementRequestModel();
});