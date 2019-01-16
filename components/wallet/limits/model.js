define([], function() {
  "use strict";
  var WalletLimitsModel = function() {
    var modelInitialized = false,
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
  return new WalletLimitsModel();
});