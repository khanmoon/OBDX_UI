define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReportListLocale = function() {
    return {
      root: {
        reportList: {
          scheduledReports: "Scheduled Reports",
          viewReportSchedule: "View Report Schedule",
          reportId: "Report Id",
          reportName: "Report Name",
          reportFrequency: "Report Frequency",
          startDate: "Start Date",
          stopDate: "Stop Date",
          cancel: "Cancel",
          scheduledBy: "Scheduled By",
          reportFormat: "Report Format",
          edit: "Edit",
          delete: "Delete",
          back: "Back",
          done: "Done",
          confirm: "Confirm",
          deletereportmsg: "Are you sure you want to delete the schedule of the Report Id -  {reportRequestIdentifier} ?",
          header: "Delete Scheduled Report Request",
          transactionName: "Delete Scheduled Report Request",

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