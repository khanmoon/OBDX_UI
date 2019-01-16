define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewStatementRequestLocale = function() {
    return {
      root: {
        reviewHeader: "You initiated a request for Account Statement. Please review details before you confirm!",
        generic: Generic,
        review: "Review",
        account: "Account Number",
        fromDate: "From Date",
        toDate: "To Date",
        header: "Request Statement",
        confirmationMsg: {
          FINAL_LEVEL_APPROVED: "You have successfully approved the request.",
          MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval.",
          REJECT_BY_HOST: "Your request has been rejected.",
          REJECT: "You have rejected the request.",
          INITIATED: "Your request has been initiated successfully.",
          AUTO_AUTH: "Your request has been accepted."
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new ReviewStatementRequestLocale();
});
