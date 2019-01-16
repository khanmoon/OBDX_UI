define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var entityLimitModel = function() {
    var baseService = BaseService.getInstance();
    var fetchUserLimitOptionsDeferred, fetchUserLimitOptions = function(deferred, businessEntity) {
      var options = {
        url: "limitPackages?businessEntity=" + businessEntity,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      fetchUserLimitOptions: function(businessEntity) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity);
        return fetchUserLimitOptionsDeferred;
      }
    };
  };
  return new entityLimitModel();
});