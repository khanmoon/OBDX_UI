define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var UserSearchAdminLocale = function() {
    return {
      root: {
        userSearchAdmin: {
          userType: "User Type",
          admin: "Administrator",
          username: "User Name",
          firstname: "First Name",
          lastname: "Last Name",
          email: "Email",
          mobilenumber: "Mobile Number",
          showMoreOptions: "More Search Options",
          showLessOptions: "Less Search Options",
          search: "Search",
          clear: "Clear",
          cancel: "Cancel",
          dataRequired: "Please provide at least 1 search input.",
          recordNotFound: "No such record found.",
          userList: "Users List",
          initials: "Initials",
          userDetails: "User Details",
          number: "Contact Details",
          mapping: "Mapping",
          user: "{firstName} {lastName}",
          noData: "No data to display"
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
  return new UserSearchAdminLocale();
});
