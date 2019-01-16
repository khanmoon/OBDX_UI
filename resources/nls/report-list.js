define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReportListLocale = function() {
    return {
      root: {
        reportList: {
          reportList: "My Reports",
          search: "Search",
          reportId: "Report Id",
          reportName: "Report Name",
          generationDate: "Generation Date",
          from: "From Date",
          to: "To Date",
          noData: "No Data",
          generationDateTime: "Generation Date and Time",
          reportStatus: "Status",
          searchEnable: "Search Enable",
          searchAllowed: "Search Allowed",
          select: "Select",
          details: "Details",
          reportSubId: "Report Sub Id",
          cancel: "Cancel",
          collectionList: "List of reports",
          adhoc: "Adhoc",
          scheduled: "Scheduled",
          navBarDescription: "Report Frequency",
          invalidDateCombo: "End Date cannot be before Start Date",
          invalidStartDate: "Start date cannot be after current date",
          invalidEndDate: "End date cannot be after current date",

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
