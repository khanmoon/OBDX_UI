define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var LinkAccountLocale = function() {
    return {
      root: {
        linkAccountHeading: "Zigmax",
        info: "With Zigmax, you can manage your money at one place",
        title: "Link Account",
        linkAccount: "Link Account",
        linkmoreAccount: "Click here to link/delink an account",
        goToLinkAccountDashboard: "View Dashboard",
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new LinkAccountLocale();
});
