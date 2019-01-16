define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var PendingApprovalsReportLocale = function() {
    return {
      root: {
        partyParam: {
          partyId: "Party ID",
          partyName: "Party Name"

        },
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
  return new PendingApprovalsReportLocale();
});