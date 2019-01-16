define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";
  var RolePreferenceModel = function() {
    var Model = function() {
      this.payload = {
          "roleId": "",
          "preferenceMappingDTOs": []
        };
        this.limitPackage = {
          "roleId": "",
          "entityLimitPackageDTOs": []
        };
    };
    var baseService = BaseService.getInstance();
    var getEnterpriseRolesDeferred, getEnterpriseRoles = function(deferred) {
        var params = {
            "isLocal": true
          },
          options = {
            url: "enterpriseRoles?isLocal={isLocal}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      getRolePreferencesDeferred, getRolePreferences = function(selectedRoleId, deferred) {
        var params = {
            "roleId": selectedRoleId
          },
          options = {
            url: "rolePreferences/{roleId}/preferences",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      },
      createRolePreferenceDeferred, createRolePreference = function(roleId, payload, deferred) {
        var params = {
            "roleId": roleId
          },
          options = {
            url: "rolePreferences/{roleId}/preferences",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options, params);
      },
      getPreferencesDeferred, getPreferences = function(deferred) {
        var options = {
          url: "rolePreferences",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getLimitPackagesDeferred,
      getLimitPackages = function(deferred) {
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
      setLimitPackagesDeferred,
      setLimitPackages = function(deferred, payload, roleId) {
        var options = {
          url: "rolePreferences/" + roleId,
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      fetchUserLimitOptionsDeferred,
      fetchUserLimitOptions = function(deferred, businessEntity) {
        var options = {
          url: "limitPackages?businessEntity=" + businessEntity,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fireBatchDeferred, fireBatch = function(deferred, batchRequest, type) {
        var options = {
          url: "batch",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {
          type: type
        }, batchRequest);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      createRolePreference: function(roleId, payload) {
        createRolePreferenceDeferred = $.Deferred();
        createRolePreference(roleId, payload, createRolePreferenceDeferred);
        return createRolePreferenceDeferred;
      },
      getEnterpriseRoles: function() {
        getEnterpriseRolesDeferred = $.Deferred();
        getEnterpriseRoles(getEnterpriseRolesDeferred);
        return getEnterpriseRolesDeferred;
      },
      getPreferences: function() {
        getPreferencesDeferred = $.Deferred();
        getPreferences(getPreferencesDeferred);
        return getPreferencesDeferred;
      },
      getRolePreferences: function(roleId) {
        getRolePreferencesDeferred = $.Deferred();
        getRolePreferences(roleId, getRolePreferencesDeferred);
        return getRolePreferencesDeferred;
      },
      getLimitPackages: function() {
        getLimitPackagesDeferred = $.Deferred();
        getLimitPackages(getLimitPackagesDeferred);
        return getLimitPackagesDeferred;
      },
      setLimitPackages: function(payload, roleId) {
        setLimitPackagesDeferred = $.Deferred();
        setLimitPackages(setLimitPackagesDeferred, payload, roleId);
        return setLimitPackagesDeferred;
      },
      fetchUserLimitOptions: function(businessEntity) {
        fetchUserLimitOptionsDeferred = $.Deferred();
        fetchUserLimitOptions(fetchUserLimitOptionsDeferred, businessEntity);
        return fetchUserLimitOptionsDeferred;
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);
        return fireBatchDeferred;
      }
    };
  };
  return new RolePreferenceModel();
});
