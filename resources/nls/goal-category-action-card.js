define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var DashboardLocale = function() {
    return {
      root: {
        "goal-category_title": "Goal Category",
        "goal-category_description": "Goal Category",
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
  return new DashboardLocale();
});