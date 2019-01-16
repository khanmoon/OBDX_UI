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
      createEnterpriseRoleDeferred, createEnterpriseRole = function(createPayload, deferred) {
        var options = {
          url: "enterpriseRoles",
          data: createPayload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      };
    return {
      listRoles: function(roleName, roleDesc) {
        listRolesDeferred = $.Deferred();
        listRoles(roleName, roleDesc, listRolesDeferred);

        return listRolesDeferred;
      },
      createEnterpriseRole: function(payload) {
        createEnterpriseRoleDeferred = $.Deferred();
        createEnterpriseRole(payload, createEnterpriseRoleDeferred);
        return createEnterpriseRoleDeferred;
      }
    };
  };
  return new EnterpriseRoleModel();
});