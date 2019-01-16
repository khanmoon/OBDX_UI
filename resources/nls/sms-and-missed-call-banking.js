define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var SMSBankingOverviewLocale = function() {
    return {
      root: {
        header : "SMS and Missed Call Banking",
        smsBanking : "SMS Banking",
        missedCallBanking : "Missed Call Banking",
        generic : Generic
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
  return new SMSBankingOverviewLocale();
});
