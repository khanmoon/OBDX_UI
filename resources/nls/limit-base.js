define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/financial-limits-common"
], function(Messages, Generic, Limits_common) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        limit: {
          limitheader: "Limit Definition"
        },

        common: Limits_common,
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display."
        },
        navLabels: {
          LimitGroup: "Limit Group",
          Events: "Events",
          Limits: "Limits",
          Service: "Service"
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
  return new OriginationLocale();
});
