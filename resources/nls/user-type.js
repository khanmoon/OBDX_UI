define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/user-management-common",
  "ojL10n!resources/nls/user-management-headers"
], function(Messages, Generic, UMCommon, UMHeaders) {
  "use strict";
  var UserTypeLocale = function() {
    return {
      root: {
        fieldname: {
          userType: "User Type",
          select: "Please Select",
          username: "User Name",
          firstname: "First Name",
          lastname: "Last Name",
          email: "Email ID",
          mobilenumber: "Mobile Number",
          partyname: "Party Name",
          partyid: "Party ID",
          showMoreOptions: "More Search Options"
        },

        messages: Messages,
        generic: Generic,
        common: UMCommon,
        headers: UMHeaders
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
  return new UserTypeLocale();
});