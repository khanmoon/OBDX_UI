define([

], function() {
  "use strict";
  var WalletUnclaimFundsModel = function() {
    var modelInitialized = false,
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      walletId, errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid wallet Id. ";
          return message;
        }()
      };
    return {
      init: function(walletIdentifier) {
        walletId = walletIdentifier || undefined;
        if (!walletId) {
          throw new Error(errors.InitializationException);
        }
        modelInitialized = true;
        this.getPayeeList();
        return modelInitialized;
      }
    };
  };
  return new WalletUnclaimFundsModel();
});