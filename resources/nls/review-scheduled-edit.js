define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReportListLocale = function() {
    return {
      root: {
        reportList: {
          review: "Review",
          reviewMessage: "Make sure the details are correct before you confirm",
          scheduledReports: "Scheduled Reports",
          editReportSchedule: "Edit Report Schedule",
          reportId: "Report Id",
          reportName: "Report Name",
          reportFrequency: "Report Frequency",
          startDate: "Start Generating",
          endDate: "Stop Generating",
          cancel: "Cancel",
          scheduledBy: "Scheduled By",
          reportFormat: "Report Format",
          save: "Save",
          back: "Back",
          done: "Done",
          confirm: "Confirm",
          transactionName: "Edit Report",
          header: "Confirm Edit Report Schedule",

          status: {
            PROCESSED: "Processed",
            PENDING: "Pending",
            ERROR: "Error"
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
  return new ReportListLocale();
});