define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewPhysicalStatement = function() {
    return {
      root: {
        common: {
          reviewHeader: "You initiated a request for statement. Please review details before you confirm!",
          review: "Review",
          requestStatement: "Statement Request"
        },
        accountActivity: {
          physicalStatementReview: "Please confirm the period of the statement.",
          fromDate: "From Date",
          toDate: "To Date",
          accountNumber: "Account Number",
          cancel: "Cancel",
          statement: "Request statement"
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
  return new ReviewPhysicalStatement();
});