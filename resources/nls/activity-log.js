define([], function() {
  "use strict";
  var ActivityLogLocale = function() {
    return {
      root: {
        activityLogDetails: {
          labels: {
            header: "Activity Log {count}",
            PARTY_MAINTENANCE: "Corporate",
            ADMIN_MAINTENANCE: "Admin",
            date: "Date",
            type: "Type",
            referenceNo: "Reference No",
            partyName: "Party Name",
            description: "Description",
            status: "Status",
            title: "Activity Log Details",
            linkDetails: "Click to see details of {transactionId}"
          },
          transactionList: {
            PENDING_APPROVAL: "Pending Approval"
          },
          status: {
            PENDING_APPROVAL: "In Progress",
            REJECTED: "Rejected",
            APPROVED: "Processed",
            INITIATED: "Initiated",
            COMPLETED: "Processed",
            EXPIRED: "Expired",
            MODIFICATION_REQUESTED: "Modification Requested"
          },
          clickHere: "Click Here For {accountNo} Details"
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
  return new ActivityLogLocale();
});
