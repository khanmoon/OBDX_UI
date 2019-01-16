define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var customizeCardLocale = function() {
    return {
      root: {
        isaddOnAllowed: "Add an authorized user",
        isBalanceTransferAllowed: "Transfer a balance to my new credit card",
        authorizedUsers: "Authorized Users",
        balanceTransfer: "Balance Transfer",
        addOnInfo1: "You may add up to five additional card holders.",
        addOnInfo2: "The primary card holder will be responsible for all transactions including interest and fees charges.",
        balanceTransferInfo: "You may transfer up to three balances from any cards. Balance transfers may be subject to a fee. Please review the Pricing and Terms.",
        noCustomizationSupported: "No Customization is supported for this offer.",
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
  return new customizeCardLocale();
});