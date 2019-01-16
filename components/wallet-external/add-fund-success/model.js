define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WalletPaySuccessModel = function() {
    var Model = function() {
        this.payInDTO = {
          transactionReferenceNo: null,
          transactionAmount: {
            amount: null,
            currency: "AUD"
          },
          comments: null,
          transactionStatus: "SUCCESSFUL",
          bankReferenceNo: null
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),

      getWalletDetailsDeferred, getWalletDetails = function(id, deferred) {
        var options = {
            url: "wallets/{walletId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            walletId: id
          };
        baseService.fetch(options, params);
      },
      getWalletDeferred, getWallet = function(deferred) {
        var options = {
          url: "wallets/me",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      completeTransactionDeferred, completeTransaction = function(transactionReferenceNo, completeTransactionModel, deferred) {
        var options = {
            url: "wallets/{transactionReferenceNo}/credit",
            data: completeTransactionModel,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            transactionReferenceNo: transactionReferenceNo
          };
        baseService.update(options, params);
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
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getWallet: function() {
        objectInitializedCheck();
        getWalletDeferred = $.Deferred();
        getWallet(getWalletDeferred);
        return getWalletDeferred;
      },
      getWalletDetails: function(walletId) {
        objectInitializedCheck();
        getWalletDetailsDeferred = $.Deferred();
        getWalletDetails(walletId, getWalletDetailsDeferred);
        return getWalletDetailsDeferred;
      },
      completeTransaction: function(transactionReferenceNo, completeTransactionModel) {
        objectInitializedCheck();
        completeTransactionDeferred = $.Deferred();
        completeTransaction(transactionReferenceNo, completeTransactionModel, completeTransactionDeferred);
        return completeTransactionDeferred;
      }
    };
  };
  return new WalletPaySuccessModel();
});