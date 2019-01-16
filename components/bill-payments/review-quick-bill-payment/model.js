define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var ReviewQuickPaymentModel = function () {
      var billPaymentDeferred, billPayment = function(model, deferred) {
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
            billPayment: function(model) {
            billPaymentDeferred = $.Deferred();
            billPayment(model, billPaymentDeferred);
            return billPaymentDeferred;
        }
      };
    };
    return new ReviewQuickPaymentModel();
});
