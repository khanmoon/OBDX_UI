define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var CoolingLimitModel = function() {
    var baseService = BaseService.getInstance(),
      fetchCoolingLimitsDeffered, fetchCoolingLimits = function(deffered) {
        var options = {
          url: "financialLimits?limitType=DUR",
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
      fetchCoolingLimits: function() {
        fetchCoolingLimitsDeffered = $.Deferred();
        fetchCoolingLimits(fetchCoolingLimitsDeffered);
        return fetchCoolingLimitsDeffered;
      }
    };
  };
  return new CoolingLimitModel();
});