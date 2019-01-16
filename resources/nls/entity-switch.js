define([], function() {
  "use strict";
  var EntityLocale = function() {
    return {
      root: {
        entity: {
          currentView: "Current Entity",
          userDashboards: "My Dashboards",
          selectDashboard: "Select Dashboard"
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
  return new EntityLocale();
});