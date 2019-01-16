define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var Limits = function() {
    var baseService = BaseService.getInstance(),
      fetchLimitsDeffered, fetchLimits = function(deffered) {
        var options = {
          url: "accounts",

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
      fetchLimits: function() {
        fetchLimitsDeffered = $.Deferred();
        fetchLimits(fetchLimitsDeffered);
        return fetchLimitsDeffered;
      }
    };
  };
  return new Limits();
});