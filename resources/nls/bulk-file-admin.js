define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var bulkFileAdminLocale = function() {
    return {
      root: {
        bulkFileAdmin: {
          labels: {
            type: "Type",
            referenceNo: "Reference No",
            initiatedBy: "Initiated By",
            status: "Status",
            fileName: "File Name",
            totalAmount: "File Amount",
            valueDate: "Value Date",
            fileIdentifier: "File Identifier",
            recRefId: "Record Reference No",
            fileReferenceNo: "File Reference No"
          },
          status: {
            PENDING_APPROVAL: "In Progress",
            REJECTED: "Rejected",
            APPROVED: "Processed",
            INITIATED: "Initiated",
            COMPLETED: "Processed"
          }
        },
        generic: Generic
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
  return new bulkFileAdminLocale();
});
