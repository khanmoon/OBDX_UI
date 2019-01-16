define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          success: {
            succcessful: "Success!",
            successMsg: "Transaction Successful",
            failure: "Fail!",
            failureMsg: "Unable to complete the transaction.Please contact bank administrator",
            done: "Done",
            balance: "Wallet balance :"
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
  return new TransactionLocale();
});