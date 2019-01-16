define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var confirmAuthenticationMaintenanceModel = function() {
    var baseService = BaseService.getInstance();
    var createAuthenticationMaintenanceDeferred, createAuthenticationMaintenance = function(segment, payload, deferred) {
        var options = {
          url: "configurations/usersegment/" + segment + "/authenticationMapping",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      updateAuthenticationMaintenanceDeferred, updateAuthenticationMaintenance = function(segment, payload, deferred) {
        var options = {
          url: "configurations/usersegment/" + segment + "/authenticationMapping",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options);
      };
    return {
      createAuthenticationMaintenance: function(segment, data) {
        createAuthenticationMaintenanceDeferred = $.Deferred();
        createAuthenticationMaintenance(segment, data, createAuthenticationMaintenanceDeferred);
        return createAuthenticationMaintenanceDeferred;
      },
      updateAuthenticationMaintenance: function(segment, data) {
        updateAuthenticationMaintenanceDeferred = $.Deferred();
        updateAuthenticationMaintenance(segment, data, updateAuthenticationMaintenanceDeferred);
        return updateAuthenticationMaintenanceDeferred;
      }
    };
  };
  return new confirmAuthenticationMaintenanceModel();
});