define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var LimitPackageModel = function() {
    var baseService = BaseService.getInstance(),
      fetchCummulativeLimitsDeffered, fetchCummulativeLimits = function(deffered) {
        var options = {

          url: "financialLimits?limitType=PER",
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
      fetchCummulativeLimits: function() {
        fetchCummulativeLimitsDeffered = $.Deferred();
        fetchCummulativeLimits(fetchCummulativeLimitsDeffered);
        return fetchCummulativeLimitsDeffered;
      }
    };
  };
  return new LimitPackageModel();
});
