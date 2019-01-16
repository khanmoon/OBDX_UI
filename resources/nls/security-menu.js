define([], function() {
  "use strict";
  var SecurityMenu = function() {
    return {
      root: {
        header: "Security Settings",
        labels: {
          changePassword: "Change Password",
          setSecurityQuestion: "Set Security Question",
          managePin: "Manage Pin",
          managePattern: "Manage Pattern",
          manageTouchID: "Manage Touch ID",
          manageFaceID: "Manage Face ID",
          deviceUnbinding: "Alternate Login",
          pushUnbinding: "Push Notifications",
          wearableSetPin: "Set/Reset Wearable Pin",
          patternVisiblity: "Pattern Visibility",
          smsAndMissedCallBanking: "SMS and Missed Call Banking"
        },
        errors: {
          WATCH_NOT_CONNECTED: "You have not connected any watches. Please connect one and continue."
        },
        clickHere: "Click Here To {action}"
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
  return new SecurityMenu();
});
