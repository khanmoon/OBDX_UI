define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        common: {
          search: "Search",
          reset: "Reset",
          clear: "Clear",
          cancel: "Cancel",
          back:"Back"
        },
        audit: {
          userID: "User ID",
          partyId: "Party ID",
          partyName: "Party Name",
          startTime: "Start Time",
          endTime: "End Time",
          firstName: "First Name",
          today: "Today",
          yesterday: "Yesterday",
          l3d: "Last 3 days",
          dateRange: "Date Range",
          activity: "Activity",
          action: "Action",
          initiated: "Initiated",
          approved: "Approved",
          enquired: "Enquired",
          edited: "Edited",
          created: "Created",
          deleted: "Deleted",
          successful: "Successful",
          failed: "Failed",
          moreOptions: "More search options",
          lessOptions: "Less search options",
          from: "From",
          to: "To",
          caption: "caption",
          dateTime: "Date and Time*",
          date: "{fullYear}{month}{date}"
        },
        auditResult: {
          searchUser: "Search User",
          searchParty: "Search Party Name",
          dateTime: "Date / Time",
          administrator: "Administrator",
          retailuser: "Retail User",
          corporateuser: "Corporate User"
        },
        header: {
          auditlogmaintenance: "Audit Log Maintenance",
          auditLog: "Audit Log",
          dateTime: "Date / Time",
          userType: "User Type",
          event: "Event",
          action: "Action",
          reference: "Reference Number",
          userName: "User ID / Name",
          status: "Status",
          partyData: "Party ID / Name",
          details: "Details",
          request:"Request",
          response:"Response",
          restUrl:"Rest URL:",
          restUrlHeader: "{restUrl} {url}"
        },
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display.",
          searching: "Searching...",
          incorrectInfo: "The information you have provided is incorrect. Please check your details."
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
  return new OriginationLocale();
});
