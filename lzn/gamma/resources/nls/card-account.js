
define([
    "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var CardAccount = function() {
    return {
      root: {
        compName: "card-account",
        branch: "Branch",
        homeAddress: "Home Address",
        statementDeliveryMode: "Statement Delivery Mode",
        statementDeliveryPrefOnline: "Online",
        statementDelPrefCourier: "Courier",
        statementDelPrefBoth: "Both",
        cardDeliveryMode: "Card Delivery Mode",
        pinDeliveryMode: "Pin Delivery Mode",
        selectBranch: "Select a Branch",
        BRANCH: "Branch",
        HOME: "Home Address",
        ONLINE: "Online",
        POST: "Courier",
        BOTH: "Both",
        updateDelPreferences: "Update delivery preferences",
        additionalPref: "Additional Preferences",
        delPreferences: "Delivery Preferences",
        cardDelBranch: "Card Delivery Branch",
        pinDelBranch: "Pin Delivery Branch",
        generic: Generic
      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new CardAccount();
});