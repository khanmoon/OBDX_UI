define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-external-payment"
], function($, BaseService) {
  "use strict";
  var ExternalPaymentModel = function() {
    var Model = function() {
        this.EPIModel = {
          transferDetails: {
            merchantCode: null,
            transactionAmount: {
              amount: null,
              currency: null
            },
            serviceCharges: {
              amount: null,
              currency: null
            },
            partyId: null,
            amount: {
              amount: null,
              currency: null
            },
            remarks: null,
            status: "INT",
            userReferenceNo: null,
            debitAccountId: {
              value: null
            }
          },
          epiRefId: null
        };
        this.EPIVerifyModel = {
          merchantCode: null,
          successStaticUrlFlag: null,
          failureStaticUrlFlag: null,
          staticSuccessUrl: null,
          dynamicSuccessUrl: null,
          staticFailureUrl: null,
          dynamicFailureUrl: null
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      logOutDeferred, logOut = function(deferred) {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("logout");
      }
        var options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options);
      },
      logOutDBAuthDeferred, logOutDBAuth = function(deferred) {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("logout");
      }
      var options = {
        url: "session",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.remove(options);
    },
      readMerchantTransferDeferred, readMerchantTransfer = function(refId, deferred) {

        var options = {
            url: "payments/transfers/merchantTransferData?epiRefId={epiRefId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            epiRefId: refId
          };
        baseService.fetch(options, params);
      },
      readMerchantDeferred, readMerchant = function(merchantCode, deferred) {

        var options = {
            url: "payments/merchants/{merchantCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "merchantCode": merchantCode
          };
        baseService.fetch(options, params);
      },
      initiatePaymentDeferred, initiatePayment = function(payload, deferred) {

        var options = {
          data: payload,
          url: "payments/transfers/external",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      verifyPaymentDeferred, verifyPayment = function(payload, paymentId, deferred) {

        var options = {
            data: payload,
            url: "payments/transfers/external/{paymentId}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "paymentId": paymentId
          };
        baseService.patch(options, params);
      },
      redirectPageDeferred, redirectPage = function(redirectURL, deferred) {

        var options = {
          url: redirectURL,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getDomesticCurrencyDeferred, getDomesticCurrency = function(deferred) {

        var options = {
          url: "bankConfiguration",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      submitOTPDeferred, submitOTP = function(payload, baseUrl, code, deferred) {
        var options = {
          url: baseUrl + "/authentication",
          headers: {
            "TOKEN_ID": code
          },
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      resendOTPDeferred, resendOTP = function(payload, baseUrl, deferred) {
        var options = {
          url: baseUrl,
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.patch(options);
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      readMerchantTransfer: function(refId) {
        readMerchantTransferDeferred = $.Deferred();
        readMerchantTransfer(refId, readMerchantTransferDeferred);
        return readMerchantTransferDeferred;
      },
      readMerchant: function(merchantCode) {
        readMerchantDeferred = $.Deferred();
        readMerchant(merchantCode, readMerchantDeferred);
        return readMerchantDeferred;
      },
      initiatePayment: function(payload) {
        initiatePaymentDeferred = $.Deferred();
        initiatePayment(payload, initiatePaymentDeferred);
        return initiatePaymentDeferred;
      },
      verifyPayment: function(payload, paymentId) {
        verifyPaymentDeferred = $.Deferred();
        verifyPayment(payload, paymentId, verifyPaymentDeferred);
        return verifyPaymentDeferred;
      },
      redirectPage: function(redirectURL) {
        redirectPageDeferred = $.Deferred();
        redirectPage(redirectURL, redirectPageDeferred);
        return redirectPageDeferred;
      },
      getDomesticCurrency: function() {
        getDomesticCurrencyDeferred = $.Deferred();
        getDomesticCurrency(getDomesticCurrencyDeferred);
        return getDomesticCurrencyDeferred;
      },
      submitOTP: function(payload, baseUrl, code) {
        submitOTPDeferred = $.Deferred();
        submitOTP(payload, baseUrl, code, submitOTPDeferred);
        return submitOTPDeferred;
      },
      resendOTP: function(payload, baseUrl) {
        resendOTPDeferred = $.Deferred();
        resendOTP(payload, baseUrl, resendOTPDeferred);
        return resendOTPDeferred;
      },
      logOut: function() {
        logOutDeferred = $.Deferred();
        logOut(logOutDeferred);
        return logOutDeferred;
      },
      logOutDBAuth: function() {
        logOutDBAuthDeferred = $.Deferred();
        logOutDBAuth(logOutDBAuthDeferred);
        return logOutDBAuthDeferred;
      }
    };
  };
  return new ExternalPaymentModel();
});