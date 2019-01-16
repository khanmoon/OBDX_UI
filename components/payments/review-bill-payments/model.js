define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var billPaymentsModel = function() {
    var baseService = BaseService.getInstance(),
      getBillPaymentDetailsDeferred, getBillPaymentDetails = function(paymentId, deferred) {
        var options = {
          url: "payments/transfers/bill/" + paymentId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBillerDetailsDeferred, getBillerDetails = function(billerId, deferred) {
        var options = {
          url: "payments/billers/" + billerId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getBillPaymentDetails: function(paymentId) {
        getBillPaymentDetailsDeferred = $.Deferred();
        getBillPaymentDetails(paymentId, getBillPaymentDetailsDeferred);
        return getBillPaymentDetailsDeferred;
      },
      getBillerDetails: function(billerId) {
        getBillerDetailsDeferred = $.Deferred();
        getBillerDetails(billerId, getBillerDetailsDeferred);
        return getBillerDetailsDeferred;
      }
    };
  };
  return new billPaymentsModel();
});