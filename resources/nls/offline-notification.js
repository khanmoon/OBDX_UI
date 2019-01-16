define([], function() {
  "use strict";
  var OfflineNotificationLocale = function() {
    return {
      root: {
        offlineMessage: "Oops! You currently seem to be offline",
        lastActivity: "Last updated at {lat}",
        dismiss: "Dismiss",
        dismissTitle: "Click to dismiss the notification"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new OfflineNotificationLocale();
});