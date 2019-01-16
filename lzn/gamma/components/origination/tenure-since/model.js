define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TenureSinceModel = function() {
    var baseService = BaseService.getInstance(),
      getMonthsDeferred, getMonths = function(deferred) {
        var options = {
          url: "origination/months",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetchJSON(options);
      };
    return {
      getMonths: function() {
        getMonthsDeferred = $.Deferred();
        getMonths(getMonthsDeferred);
        return getMonthsDeferred;
      }
    };
  };
  return new TenureSinceModel();
});