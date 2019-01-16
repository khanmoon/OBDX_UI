define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WalletAddModel = function() {
    var modelInitialized = false,
      baseService = BaseService.getInstance(),
      walletId, deleteRequestDeferred, deleteRequest = function(notificationId, deferred) {
        var options = {
            url: "wallets/{walletId}/notifications/{notificationId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            walletId: walletId,
            notificationId: notificationId
          };
        baseService.remove(options, params);
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
      init: function(walletIdentifier) {
        walletId = walletIdentifier || undefined;
        if (!walletId) {
          throw new Error(errors.InitializationException);
        }
        modelInitialized = true;
        return modelInitialized;
      },

      deleteRequest: function(notificationId) {
        objectInitializedCheck();
        deleteRequestDeferred = $.Deferred();
        deleteRequest(notificationId, deleteRequestDeferred);
        return deleteRequestDeferred;
      }
    };
  };
  return new WalletAddModel();
});