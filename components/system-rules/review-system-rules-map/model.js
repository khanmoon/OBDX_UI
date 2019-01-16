define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var ReviewSystemRulesModel = function () {
      var setLimitPackagesDeferred,setLimitPackages = function(payload, roleId, deferred) {
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
      },createRolePreferenceDeferred, createRolePreference = function(roleId, payload, deferred) {
        var params = {
            "roleId": roleId
          },
          options = {
            url: "rolePreferences/{roleId}/preferences",
            data: payload,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.update(options, params);
      };
    return {
      createRolePreference: function(roleId, payload) {
        createRolePreferenceDeferred = $.Deferred();
        createRolePreference(roleId, payload, createRolePreferenceDeferred);
        return createRolePreferenceDeferred;
      },
setLimitPackages: function(payload, roleId) {
        setLimitPackagesDeferred = $.Deferred();
        setLimitPackages(payload, roleId, setLimitPackagesDeferred);
        return setLimitPackagesDeferred;
      }
      };
    };
    return new ReviewSystemRulesModel();
});
