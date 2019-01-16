define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var accessibleEntityModel = function() {
    var baseService = BaseService.getInstance();
    var fetchAccessDeferred, fetchAccess = function(searchParams, deferred) {
        var options = {
          url: "accessPoints?accessType={accessType}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, searchParams);
      },
      fetchUserLimitOptionsDeferred, fetchUserLimitOptions = function(deferred, businessEntity,assignableEntitiesData) {
        var params = {
            "assignableEntitiesData": assignableEntitiesData
          },
         options = {
           url: "limitPackages?assignableEntities={assignableEntitiesData}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        if (businessEntity) {
          options.headers = {
            "X-Target-Unit": businessEntity
          };
        }

        baseService.fetch(options, params);
      };
    return {
      fetchUserLimitOptions: function(businessEntity,assignableEntitiesData) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity,assignableEntitiesData);
        return fetchUserLimitOptionsDeferred;
      },
      fetchAccess: function(searchParams) {
        fetchAccessDeferred = $.Deferred();
        fetchAccess(searchParams, fetchAccessDeferred);
        return fetchAccessDeferred;
      }
    };
  };
  return new accessibleEntityModel();
});
