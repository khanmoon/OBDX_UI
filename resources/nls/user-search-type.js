define([], function() {
  "use strict";
  var UserSearchTypeLocale = function() {
    return {
      root: {
        chooseUserType: "Select User Type on which you want to operate",
        userSelection: "User Type Selection",
        adminUser: "Admin User",
        user: "User File Identifier Mapping",
        corporateUser: "Corporate User"

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
  return new UserSearchTypeLocale();
});
