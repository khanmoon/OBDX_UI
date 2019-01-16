define([], function() {
  "use strict";
  var LimitsLocale = function() {
    return {
      root: {
        package_create: {
          create: "Create",
          edit: "Edit",
          limit_package_code: "Limit Package Code",
          limit_package_desc: "Limit Package Description",
          access_point:"Touch Point",
          access_point_group:"Touch Point Group",
          role: "Role",
          select_role: "Select Role",
          select_access_point: "Select Touch Point",
          availableToRole: "Available To Role"
        },
        pageHeader: "Limit Package Management"
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
  return new LimitsLocale();
});
