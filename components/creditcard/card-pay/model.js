define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for Card pay
   *
   * @namespace
   * @class
   */
  var CardPayModel = function() {

    var params, baseService = BaseService.getInstance();
    var paybillDeferred, paybill = function(model, deferred) {
      params = {};
      var options = {
        url: "payments/transfers/creditCard",
        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };
      baseService.add(options);
    };
    var confirmPaymentDeferred, confirmPayment = function(paymentId, deferred) {
      params = {
        "paymentId": paymentId
      };
      var options = {
        url: "payments/transfers/creditCard/{paymentId}",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.patch(options, params);
    };
    var confirmPaymentWithAuthDeferred, confirmPaymentWithAuth = function(paymentId, authKey, deferred) {
      params = {
        "paymentId": paymentId
      };
      var options = {
        url: "payments/transfers/creditCard/{paymentId}/authentication",
        headers: {
          "TOKEN_ID": authKey
        },
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.update(options, params);
    };
    return {
      paybill: function(model) {
        paybillDeferred = $.Deferred();
        paybill(model, paybillDeferred);
        return paybillDeferred;
      },
      confirmPayment: function(paymentId) {
        confirmPaymentDeferred = $.Deferred();
        confirmPayment(paymentId, confirmPaymentDeferred);
        return confirmPaymentDeferred;
      },
      confirmPaymentWithAuth: function(paymentId, authKey) {
        confirmPaymentWithAuthDeferred = $.Deferred();
        confirmPaymentWithAuth(paymentId, authKey, confirmPaymentWithAuthDeferred);
        return confirmPaymentWithAuthDeferred;
      }
    };
  };
  return new CardPayModel();
});