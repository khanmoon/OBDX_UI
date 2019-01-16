define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var domesticIndiaPayeeModel = function() {
    var
      baseService = BaseService.getInstance(),
      getPayeeDetailsDeferred, getPayeeDetails = function(payeeGroupId, payeeId, deferred) {
        var options = {
          url: "payments/payeeGroup/" + payeeGroupId + "/payees/domestic/" + payeeId,
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
      /**
       * Method to initialize the described model
       */
      getPayeeDetails: function(payeeGroupId, payeeId) {
        getPayeeDetailsDeferred = $.Deferred();
        getPayeeDetails(payeeGroupId, payeeId, getPayeeDetailsDeferred);
        return getPayeeDetailsDeferred;
      }
    };
  };
  return new domesticIndiaPayeeModel();
});