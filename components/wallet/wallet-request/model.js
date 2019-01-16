define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WalletRequestModel = function() {
    var Model = function() {
        this.amount = {
          amount: null,
          currency: ""
        };
        this.payeeEmail = null;
        this.payeeNumber = null;
        this.comments = null;
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      walletId, requestFundsDeferred, requestFunds = function(model, deferred) {
        var options = {
            url: "wallets/{walletId}/requests",
            data: model,
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
        baseService.add(options, params);
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
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      requestFunds: function(requestFundsModel) {
        objectInitializedCheck();
        requestFundsDeferred = $.Deferred();
        requestFunds(requestFundsModel, requestFundsDeferred);
        return requestFundsDeferred;
      }
    };
  };
  return new WalletRequestModel();
});