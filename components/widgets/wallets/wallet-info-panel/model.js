define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WalletInfoPanelModel = function() {
    var modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      walletId, getWalletDetailsDeferred, getWalletDetails = function(deferred) {
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
            walletId: walletId
          };
        baseService.fetch(options, params);
      },
      claimMoneyDeferred, claimMoney = function(deferred) {
        var options = {
            url: "wallets/{walletId}/claims",
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
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
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

      getWalletDetails: function() {
        objectInitializedCheck();
        if (modelStateChanged) {
          getWalletDetailsDeferred = $.Deferred();
          $.when(getWalletDetails).done(function() {
            getWalletDetails(getWalletDetailsDeferred);
          });
        }
        return getWalletDetailsDeferred;
      },
      claimMoney: function() {
        objectInitializedCheck();
        claimMoneyDeferred = $.Deferred();
        $.when(claimMoney).done(function() {
          claimMoney(claimMoneyDeferred);
        });
        return claimMoneyDeferred;
      }
    };
  };
  return new WalletInfoPanelModel();
});