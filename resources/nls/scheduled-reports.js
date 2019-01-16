define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReportListLocale = function() {
    return {
      root: {
        reportList: {
          scheduledReports: "Scheduled Reports",
          search: "Search",
          reportId: "Report Id",
          reportName: "Report Name",
          reportFrequency: "Report Frequency",
          accountNumber: "Account Number",
          startDate: "Start Date",
          endDate: "End Date",
          noData: "No Data",
          generationDateTime: "Generation Date and Time",
          reportStatus: "Status",
          searchEnable: "Search Enable",
          searchAllowed: "Search Allowed",
          select: "Select",
          details: "Details",
          cancel: "Cancel",
          clear: "Clear",
          collectionList: "List of reports",
          scheduleFrequency: "Schedule Frequency",
          selectReportType: "Select",

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