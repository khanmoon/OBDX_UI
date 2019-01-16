define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var scanToPayModel = function() {
    var Model = function() {
        this.payload = {
          userReferenceNo: null,
          purpose: null,
          purposeText: null,
          amount: {
            currency: null,
            amount: null
          },
          debitAccountId: {
            value: null
          },
          status: null,
          beneCode: null
        };
      },
      baseService = BaseService.getInstance(),
      makePaymentDeferred, makePayment = function(deferred, payload) {
        var options = {
          url: "payments/transfers/qrCode",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
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