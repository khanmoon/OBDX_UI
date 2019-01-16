define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var internalPayeeModel = function() {
    var baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      getBranchesDeferred, getBranches = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
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

      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);
        return getBranchesDeferred;
      }
    };
  };
  return new internalPayeeModel();
});