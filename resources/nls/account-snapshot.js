define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var snapShotregistration = function() {
    return {
      root: {
        goToDashoard: "Go To Dashboard",
        disableQuickSnapShot: "Disable Quick Snapshot",
        successfullyDisabled: "You have disabled the Quick Snapshot feature. You can any time enable it in future from the login page.",
        snapshotDisabled: "Snapshot Disabled",
        CasaAccounts: "Current and Savings Account",
        MyAccount: "My Account",
        ddSubText: "{product} | {accountType}",
        accountType: {
          CON: "Conventional",
          ISL: "Islamic"
        },
        savingsOrCurrent: {
          SAVIN: "Savings A/C",
          CACCR: "Current A/C"
        },
        disableQuickSnapshot: "Disable Account Snapshot",
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
