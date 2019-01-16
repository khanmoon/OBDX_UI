define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var snapShotregistration = function() {
    return {
      root: {
        goToDashoard: "Go To Dashboard",
        disableQuickSnapShot: "Disable Quick Snapshot",
        CasaAccounts: "Current and Savings Account",
        recentTransaction: "Recent Transaction",
        balanceDetails: "Balance Details",
        availableBalance: "Available Balance",
        currentBalance: "Current Balance",
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
  return new snapShotregistration();
});