define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var newDebtorModel = function() {
    var baseService = BaseService.getInstance(),

      readDebtorDeferred, readDebtor = function(payerId, groupId, deferred) {
        var options = {
            url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "payerId": payerId,
            "groupId": groupId
          };
        baseService.fetch(options, params);
      };
    return {

      readDebtor: function(payerId, groupId) {
        readDebtorDeferred = $.Deferred();
        readDebtor(payerId, groupId, readDebtorDeferred);
        return readDebtorDeferred;
      }
    };
  };
  return new newDebtorModel();
});