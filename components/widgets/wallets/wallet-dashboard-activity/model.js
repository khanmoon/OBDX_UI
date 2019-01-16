define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WalletPayModel = function() {
    var modelInitialized = false,
      baseService = BaseService.getInstance(),
      walletId, fetchTransactionsDeferred, fetchTransactions = function(deferred) {
        var options = {
            url: "wallets/{walletId}/transactions?noOfTransactions=3",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            walletId: walletId
          };
        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid wallet Id. ";
          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      init: function(wId) {
        modelInitialized = true;
        walletId = wId;
        return modelInitialized;
      },

      fetchTransactions: function() {
        objectInitializedCheck();
        fetchTransactionsDeferred = $.Deferred();
        fetchTransactions(fetchTransactionsDeferred);
        return fetchTransactionsDeferred;
      }
    };
  };
  return new WalletPayModel();
});