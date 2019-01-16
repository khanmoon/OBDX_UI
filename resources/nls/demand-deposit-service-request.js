define([], function() {
  "use strict";
  var DemandDepositAnalysisLocale = function() {
    return {
      root: {
        serviceRequest: {
          title: "Service Request",
          openRequests: "Open",
          closedRequests: "Recently Closed",
          openRequestsCount: "Open ({count})",
          closedRequestsCount: "Recently Closed ({count})",
          raiseNewRequest: "Raise New Request",
          trackRequest: "Track Request",
          raiseNewRequestAlt: "Create a new Service Request",
          raiseNewRequestTitle: "Click to Raise a Service Request",
          trackRequestAlt: "Track your Requests",
          trackRequestTitle: "Click to track your Requests",
          referenceNo : "Reference Number",
          navDescription : "Service Requests",
          noData : "No Actions Pending"
        }
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new DemandDepositAnalysisLocale();
});
