define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var termDepositClosedModel = function() {
    var baseService = BaseService.getInstance(),
      getClosedDepositsDeferred, getClosedDeposits = function(deferred) {
        var options = {
          url: "accounts/deposit?status=CLOSED",
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
      getClosedDeposits: function() {
        getClosedDepositsDeferred = $.Deferred();
        getClosedDeposits(getClosedDepositsDeferred);
        return getClosedDepositsDeferred;
      }
    };
  };
  return new termDepositClosedModel();
});