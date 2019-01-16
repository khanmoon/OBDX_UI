define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reviewUserUpdateModel = function() {
    var params, baseService = BaseService.getInstance(),
      fetchUserLimitOptionsDeferred, fetchUserLimitOptions = function(deferred) {
        var options = {
          url: "limitPackages",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getEnterpriseRolesDeferred,
      getEnterpriseRoles = function(deferred) {
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
      },
      fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchChildRoleDeferred, fetchChildRole = function(enterpriseRoleId, deferred) {
        var options = {
          url: "applicationRoles?accessPointType=INT&enterpriseRole=" + enterpriseRoleId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchDeviceDataDeferred, fetchDeviceData = function(id, deferred) {
        var params = {
            "deviceId": id
          },
          options = {
            url: "mobileClient/{deviceId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      fetchChildRole: function(enterpriseRoleId) {
        fetchChildRoleDeferred = $.Deferred();
        fetchChildRole(enterpriseRoleId, fetchChildRoleDeferred);
        return fetchChildRoleDeferred;
      },
      fetchUserLimitOptions: function() {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred);
        return fetchUserLimitOptionsDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      },
      fetchDeviceData: function(Parameters) {
        fetchDeviceDataDeferred = $.Deferred();
        fetchDeviceData(Parameters, fetchDeviceDataDeferred);
        return fetchDeviceDataDeferred;
      },
      getEnterpriseRoles: function() {
        getEnterpriseRolesDeferred = $.Deferred();
        getEnterpriseRoles(getEnterpriseRolesDeferred);
        return getEnterpriseRolesDeferred;
      }
    };
  };
  return new reviewUserUpdateModel();
});
