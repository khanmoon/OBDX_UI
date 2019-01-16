define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var scanToPayModel = function() {
    var Model = function() {
        this.payload = {
          userReferenceNo: null,
          purpose: "OTH",
          purposeText: null,
          amount: {
            currency: null,
            amount: null
          },
          debitAccountId: {
            displayValue: null,
            value: null
          },
          status: null,
          beneCode: null
        };
      },
      baseService = BaseService.getInstance(),
      makePaymentDeferred, makePayment = function(deferred, payload) {
        var options = {
          headers: {
            "X-Validate-Only": "V"
          },
          url: "payments/transfers/qrCode",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      makePayment: function(payload) {
        makePaymentDeferred = $.Deferred();
        makePayment(makePaymentDeferred, payload);
        return makePaymentDeferred;
      }
    };
  };
  return new scanToPayModel();
});