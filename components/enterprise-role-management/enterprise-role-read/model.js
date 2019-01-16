define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /* Extending predefined baseService to get ajax functions. */
  var baseService = BaseService.getInstance();

  var EnterpriseRoleModel = function() {
    var fetchRoleDetailsDeferred, fetchRoleDetails = function(roleName, deferred) {

      var options = {
        url: "enterpriseRoles/" + roleName + "?isOBDXAuth=true",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var deleteRoleDeferred, deleteRole = function(roleName, deferred) {

      var options = {
        url: "enterpriseRoles/" + roleName,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.remove(options);
    };
    return {
      fetchRoleDetails: function(roleName) {
        fetchRoleDetailsDeferred = $.Deferred();
        fetchRoleDetails(roleName, fetchRoleDetailsDeferred);
        return fetchRoleDetailsDeferred;
      },
      deleteRole: function(roleName) {
        deleteRoleDeferred = $.Deferred();
        deleteRole(roleName, deleteRoleDeferred);
        return deleteRoleDeferred;
      }
    };
  };
  return new EnterpriseRoleModel();
});