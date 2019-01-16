define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var TermDepositListLocale = function() {
    return {
      root: {
        dashboard: {
          termDeposit: "Term Deposits",
          closeTermDeposit: {
            closedDeposit_title: "Closed Deposits",
            closedDeposit_description: "Deposits",
            closedDeposit_imgDesc: "Deposits Closed",
            closedDeposit_viewall: "View All"
          }
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
  return new TermDepositListLocale();
});