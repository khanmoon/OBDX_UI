define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var BillerDetailsModel = function() {
    var
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      baseService = BaseService.getInstance(),
      deleteBillerDeferred, deleteBiller = function(billerId, relationshipNumber, deferred) {
        var options = {
          url: "payments/registeredBillers/" + billerId + "/relations/" + relationshipNumber,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.remove(options);
      };
    return {
      deleteBiller: function(billerId, relationshipNumber) {
        deleteBillerDeferred = $.Deferred();
        deleteBiller(billerId, relationshipNumber, deleteBillerDeferred);
        return deleteBillerDeferred;
      }
    };
  };
  return new BillerDetailsModel();
});