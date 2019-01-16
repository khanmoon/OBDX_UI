define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WalletPayModel = function() {
    var modelInitialized = false,
      baseService = BaseService.getInstance(),

      walletId, fetchTransactionsDeferred, fetchTransactions = function(url, deferred) {
        var options = {
            url: url,
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

      fetchTransactions: function(url) {
        objectInitializedCheck();
        fetchTransactionsDeferred = $.Deferred();
        fetchTransactions(url, fetchTransactionsDeferred);
        return fetchTransactionsDeferred;
      }
    };
  };
  return new WalletPayModel();
});