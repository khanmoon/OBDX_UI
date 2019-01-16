define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /* Extending predefined baseService to get ajax functions. */
  var baseService = BaseService.getInstance();

  var EnterpriseRoleModel = function() {

    var listRolesDeferred, listRoles = function(roleName, roleDesc, deferred) {
        var options = {
          url: "enterpriseRoles?isOBDXAuth=true",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      updateEnterpriseRoleDeferred, updateEnterpriseRole = function(updatePayload, deferred) {
        var options = {
          url: "enterpriseRoles",
          data: updatePayload,
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
      listRoles: function(roleName, roleDesc) {
        listRolesDeferred = $.Deferred();
        listRoles(roleName, roleDesc, listRolesDeferred);

        return listRolesDeferred;
      },
      updateEnterpriseRole: function(payload) {
        updateEnterpriseRoleDeferred = $.Deferred();
        updateEnterpriseRole(payload, updateEnterpriseRoleDeferred);
        return updateEnterpriseRoleDeferred;
      }
    };
  };
  return new EnterpriseRoleModel();
});