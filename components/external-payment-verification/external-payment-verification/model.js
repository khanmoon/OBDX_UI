define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-external-payment"
], function($, BaseService) {
  "use strict";
  var ExternalPaymentModel = function() {
    var Model = function() {
        this.epiVerificationModel = {
          externalReferenceId: null,
          txnAmount: {
            amount: null
          }
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      initiatePaymentDeferred, initiatePayment = function(payload, deferred) {

        var options = {
          data: payload,
          url: "payments/transfers/external/verification",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      readPaymentDeferred, readPayment = function(verificationId, deferred) {
        var options = {
            url: "payments/transfers/external/verification/{verifyId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            verifyId: verificationId
          };
        baseService.fetch(options, params);
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      initiatePayment: function(payload) {
        initiatePaymentDeferred = $.Deferred();
        initiatePayment(payload, initiatePaymentDeferred);
        return initiatePaymentDeferred;
      },
      readPayment: function(verificationId) {
        readPaymentDeferred = $.Deferred();
        readPayment(verificationId, readPaymentDeferred);
        return readPaymentDeferred;
      }
    };
  };
  return new ExternalPaymentModel();
});