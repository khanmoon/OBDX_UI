define([
  "ojL10n!resources/nls/generic"
], function(Generic, HelpDeskUser) {
  "use strict";
  var HelpDeskUserLocale = function() {
    return {
      root: {
        helpDeskUser: {
          headerName: "User Helpdesk",
          userName: "User Name",
          partyId: "Party ID",
          fullName: "Full Name",
          userSegment: "User Segment",
          searchResults: "Search Results",
          helpDeskUserSearch: "Help Desk User Search",
          userTypeMandatory: "Please select a User Type",
          invalidInfo: "Please provide the correct details",
          dataRequired: "Please provide at least one search input.",
          noUserType: "Please provide User Type",
          recordNotFound: "No such record found.",
          createSessionError: "Error",
          createErrorMessage: "Helpdesk session can not be created for a locked User.",
          status: "Status",
          unlock: "Unlock",
          lock: "Lock"
        },
        generic: Generic,
        helpdeskuser: HelpDeskUser
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
  return new HelpDeskUserLocale();
});
