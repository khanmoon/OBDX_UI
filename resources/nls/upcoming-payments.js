define([], function() {
  "use strict";
  var UpcomingTNPLocale = function() {
    return {
      root: {
        upcomingTnPDetails: {
          labels: {
            header: "Upcoming Transfers & Payments",
            todayCount: "Today ({count})",
            thisWeekCount: "This Week({count})",
            thisMonthCount: "This Month ({count})"
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
  return new UpcomingTNPLocale();
});