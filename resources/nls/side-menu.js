define([], function() {
  "use strict";
  var sideMenu = function() {
    return {
      root: {
        header : "My Preferences",
        primaryAccountNumber : "Primary Account Number",
        backToDashboard: "Back To Dashboard",
        menuItems : {
          MyProfile  : "Profile",
          primaryAccount : "Primary Account Number",
          alerts : "Alerts/Notifications",
          thirdPartyApps : "Third Party Apps",
          securityAndLogin : "Security and Login",
          settings : "Settings"
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
  return new sideMenu();
});
