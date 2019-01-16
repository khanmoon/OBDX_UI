define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
    var ApplicationRolesSearchModel = function() {
    var baseService = BaseService.getInstance();
    this.getNewModel = function() {
      return new this.Model();
    };
    var fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
      var options = {
        url: "enterpriseRoles?isLocal=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchAccessPointTypeDeferred, fetchAccessPointType = function(deferred) {
      var options = {
        url: "enumerations/accessPointType",
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
        fetchUserGroupOptions: function() {
            fetchUserGroupOptionsDeferred = $.Deferred();
            fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
            return fetchUserGroupOptionsDeferred;
        },
        fetchAccessPointType: function() {
            fetchAccessPointTypeDeferred = $.Deferred();
            fetchAccessPointType(fetchAccessPointTypeDeferred);
            return fetchAccessPointTypeDeferred;
        }
  };
};
  return new ApplicationRolesSearchModel();
});
