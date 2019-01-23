define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/access-point-group-headers"
], function(Messages, Generic, AccessPointHeaders) {
  "use strict";
  var AccessPointGroupLocale = function() {
    return {
      root: {
        accessPointGroup: {
          headerName: "Touch Point Group Maintenance",
          groupCode: "Group Code",
          description: "Group Description",
          numberOfAccessPoints: "No of Touch Points",
          internal: "Internal",
          external: "External",
          view: "View",
          createAccessPointGroup: "Create Touch Point Group",
          updateAccessPointGroup: "Update Touch Point Group",
          searchError: "Search Error",
          searchErrorMessage: "Please enter either Touch Point group code or description.",
          searchResults: "Search Results",
          accessPoints: "Touch Points",
          createError: "Please select more than one Touch Points",
          confirmScreenheader: "You initiated a request for Touch Point Group. Please review details before you confirm!",
          selectAllInternal: "Select all internal Touch Points",
          selectAllExternal: "Select all external Touch Points",
          invalidCode: "Please enter valid Touch Point group code",
          invalidDescription: "Please enter valid Touch Point group description",
          groupType: "Touch Point Group Type",
          review: "Review",
          reviewwarning : "Warning!",
          cancelMessage : "Are you sure do you want to cancel the operation ?"
        },
        messages: Messages,
        generic: Generic,
        headers: AccessPointHeaders,
        info: {
          noData: "No data to display."
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
  return new AccessPointGroupLocale();
});
