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
        url: "enterpriseRoles?enterpriseRoleName=" + roleName + "&enterpriseRoleDesc=" + roleDesc + "&isOBDXAuth=true",
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
      listRoles: function(roleName, roleDesc) {
        listRolesDeferred = $.Deferred();
        listRoles(roleName, roleDesc, listRolesDeferred);

        return listRolesDeferred;
      }
    };
  };
  return new EnterpriseRoleModel();
});