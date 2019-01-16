define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WalletAddModel = function() {
    var Model = function() {
        this.payInDTO = {
          transactionAmount: {
            amount: null,
            currency: ""
          },
          comments: null
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      walletId, addFundsDeferred, addFunds = function(model, deferred) {
        var options = {
            url: "wallets/{walletId}/payin",
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
      getWalletDetailsDeferred, getWalletDetails = function(model, deferred) {
        var options = {
            url: "wallets/me",
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
      init: function(walletIdentifier) {
        walletId = walletIdentifier || undefined;
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      addFunds: function(addFundsModel) {
        objectInitializedCheck();
        addFundsDeferred = $.Deferred();
        addFunds(addFundsModel, addFundsDeferred);
        return addFundsDeferred;
      },
      getWalletDetails: function(addFundsModel) {
        objectInitializedCheck();
        getWalletDetailsDeferred = $.Deferred();
        getWalletDetails(addFundsModel, getWalletDetailsDeferred);
        return getWalletDetailsDeferred;
      }
    };
  };
  return new WalletAddModel();
});