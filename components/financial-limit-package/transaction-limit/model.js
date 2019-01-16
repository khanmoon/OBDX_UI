define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var LimitPackageModel = function() {
    var baseService = BaseService.getInstance(),
      fetchTransactionLimitsDeffered, fetchTransactionLimits = function(deffered) {
        var options = {

          url: "financialLimits?limitType=TXN",
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchTransactionLimits: function() {
        fetchTransactionLimitsDeffered = $.Deferred();
        fetchTransactionLimits(fetchTransactionLimitsDeffered);
        return fetchTransactionLimitsDeffered;
      }
    };
  };
  return new LimitPackageModel();
});