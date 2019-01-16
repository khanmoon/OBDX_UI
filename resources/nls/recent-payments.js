define([], function() {
  "use strict";
  var RecentPaymentLocale = function() {
    return {
      root: {
        labels: {
          paymentHeader: "Last 5 Payments",
          status: "Status",
          createdBy: "{FName} {LName}",
          noData: "Payments Not Initiated Recently",
          subData: "Check this section once you make a payment"
        },
        status: {
          PENDING_APPROVAL: "In Progress",
          REJECTED: "Rejected",
          APPROVED: "Processed",
          INITIATED: "Initiated",
          COMPLETED: "Processed",
          EXPIRED: "Expired",
          MODIFICATION_REQUESTED: "Modification Requested"
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
  return new RecentPaymentLocale();
});
