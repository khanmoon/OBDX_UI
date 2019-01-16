define([], function() {
  "use strict";
  var SessionSummaryLocale = function() {
    return {
      root: {
        header: {
          sessionSummary: "Session Summary"

        },
        labels: {
          startDate: "Start Date & Time",
          endDate: "End Date & Time",
          channel: "Channel",
          ipAddress: "IP Address",
          transactionDate: "Transaction Date & Time",
          transactionName: "Transaction Name",
          status: "Status",
          ok: "Ok",
          cancel: "Cancel",
          viewMore : "View More",
          viewLess : "View Less"
           }
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: true
    };
  };

  return new SessionSummaryLocale();
});
