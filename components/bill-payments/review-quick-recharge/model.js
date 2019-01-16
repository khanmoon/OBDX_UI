define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var ReviewQuickRechargeModel = function () {
      var quickBillPaymentDeferred, quickBillPayment = function(model, deferred) {
          var options = {
            url: "ebillPayments",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };
          baseService.add(options);
      };
      return {
            quickBillPayment: function(model) {
            quickBillPaymentDeferred = $.Deferred();
            quickBillPayment(model, quickBillPaymentDeferred);
            return quickBillPaymentDeferred;
        }
      };
    };
    return new ReviewQuickRechargeModel();
});
