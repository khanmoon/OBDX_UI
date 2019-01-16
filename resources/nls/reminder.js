define([], function() {
  "use strict";
  var ReminderLocale = function() {
    return {
      root: {
        reminder: {
          labels: {
            reminder: "Reminder",
            alerts: "Alerts",
            viewAll: "View All"

          }
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
  return new ReminderLocale();
});