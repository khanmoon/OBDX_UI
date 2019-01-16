define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ApplicationRolesCreateModel = function() {
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
     var fetchScopesDeferred, fetchScopes = function(deferred) {
      var options = {
        url: "accessPointScopes",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchAccessDeferred, fetchAccess = function(searchParams, deferred) {
      var options = {
        url: "accessPoints?accessType={accessType}",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, searchParams);
    };
    this.createApplicationRole = function(payload, successHandler, errorHandler) {
      var options = {
        url: "applicationRoles",
        data: payload,
        success: function(data) {
          successHandler(data);
        },
        error: function(data) {
          errorHandler(data);
        }
      };
      baseService.add(options);
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
      },
      fetchAccess: function(searchParams) {
        fetchAccessDeferred = $.Deferred();
        fetchAccess(searchParams, fetchAccessDeferred);
        return fetchAccessDeferred;
      },
      fetchScopes: function() {
        fetchScopesDeferred = $.Deferred();
        fetchScopes(fetchScopesDeferred);
        return fetchScopesDeferred;
      }
    };
  };
  return new ApplicationRolesCreateModel();
});
