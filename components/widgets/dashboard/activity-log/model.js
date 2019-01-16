define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ActivityLogModel = function() {
    var baseService = BaseService.getInstance();
    var getActivityLogDetailsDeferred, getActivityLogDetails = function(deferred) {
      var options = {
        url: "activitylog",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetchJSON(options);
    };
    return {
      getActivityLogDetails: function(module) {
        getActivityLogDetailsDeferred = $.Deferred();
        getActivityLogDetails(getActivityLogDetailsDeferred, module);
        return getActivityLogDetailsDeferred;
      }
    };
  };
  return new ActivityLogModel();
});