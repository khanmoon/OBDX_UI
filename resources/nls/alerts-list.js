define([], function() {
  "use strict";
  var alertsList = function() {
    return {
      root: {
        header: "Manage Alerts",
        labels: {
          "alerts-profile": "Profile",
          "alerts-casa": "Saving & Current",
          "alerts-td": "Term Deposits",
          "alerts-loans": "Loans",
          "alerts-payments": "Payments",
          "push-deregistration": "Push Deregistration",
          "navBarDescription": "Navigation Bar to select action"
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
  return new alertsList();
});
