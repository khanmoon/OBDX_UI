define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var WalletPayModel = function() {
    var Model = function() {
        this.amount = {
          amount: null,
          currency: "AUD"
        };
        this.payeeAccountNo = null;
        this.emailId = null;
        this.mobileNo = null;
        this.comments = null;
        this.transferMode = null;
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      modelStateChanged = true,
      walletId, getPayeeListDeferred, getPayeeList = function(deferred) {
        var options = {
            url: "wallets/{walletId}/payees",
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
      transferFundsDeferred, transferFunds = function(model, deferred) {
        var options = {
            url: "wallets/{walletId}/transfer",
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
      checkOTPConfigurationDeferred, checkOTPConfiguration = function(referencenumber, deferred) {
        var options = {
            url: "wallets/{walletId}/transfer/{referencenumber}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            walletId: walletId,
            referencenumber: referencenumber
          };
        baseService.patch(options, params);
      },
      verifyOTPDeferred, verifyOTP = function(referencenumber, otp, deferred) {
        var options = {
            headers: {
              "TOKEN_ID": otp
            },
            url: "wallets/{walletId}/transfer/{referencenumber}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            walletId: walletId,
            referencenumber: referencenumber
          };
        baseService.update(options, params);
      },
      deleteTransactionDeferred, deleteTransaction = function(referencenumber, deferred) {
        var options = {
            url: "wallets/{walletId}/transfer/{referencenumber}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            walletId: walletId,
            referencenumber: referencenumber
          };
        baseService.remove(options, params);
      },
      updateRequestStatusDeferred, updateRequestStatus = function(notificationId, deferred) {
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
        baseService.patch(options, params);
      },
      initiateNotificationPaymentDeferred, initiateNotificationPayment = function(notificationId, deferred) {
        var options = {
            url: "wallets/{walletId}/notifications/{notificationId}/acceptance",
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
        baseService.patch(options, params);
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
      getPayeeList: function() {
        objectInitializedCheck();
        if (modelStateChanged) {
          getPayeeListDeferred = $.Deferred();
          $.when(getPayeeList).done(function() {
            getPayeeList(getPayeeListDeferred);
          });
        }
        return getPayeeListDeferred;
      },
      transferFunds: function(transferFundsModel) {
        objectInitializedCheck();
        transferFundsDeferred = $.Deferred();
        transferFunds(transferFundsModel, transferFundsDeferred);
        return transferFundsDeferred;
      },
      checkOTPConfiguration: function(referencenumber) {
        objectInitializedCheck();
        checkOTPConfigurationDeferred = $.Deferred();
        checkOTPConfiguration(referencenumber, checkOTPConfigurationDeferred);
        return checkOTPConfigurationDeferred;
      },
      verifyOTP: function(referencenumber, otp) {
        objectInitializedCheck();
        verifyOTPDeferred = $.Deferred();
        verifyOTP(referencenumber, otp, verifyOTPDeferred);
        return verifyOTPDeferred;
      },
      deleteTransaction: function(referencenumber) {
        objectInitializedCheck();
        deleteTransactionDeferred = $.Deferred();
        deleteTransaction(referencenumber, deleteTransactionDeferred);
        return deleteTransactionDeferred;
      },
      updateRequestStatus: function(notificationId) {
        objectInitializedCheck();
        updateRequestStatusDeferred = $.Deferred();
        updateRequestStatus(notificationId, updateRequestStatusDeferred);
        return updateRequestStatusDeferred;
      },
      initiateNotificationPayment: function(notificationId) {
        objectInitializedCheck();
        initiateNotificationPaymentDeferred = $.Deferred();
        initiateNotificationPayment(notificationId, initiateNotificationPaymentDeferred);
        return initiateNotificationPaymentDeferred;
      }
    };
  };
  return new WalletPayModel();
});