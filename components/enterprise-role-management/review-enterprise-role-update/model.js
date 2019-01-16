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
    return {
      fetchRoleDetails: function(roleName) {
        fetchRoleDetailsDeferred = $.Deferred();
        fetchRoleDetails(roleName, fetchRoleDetailsDeferred);

        return fetchRoleDetailsDeferred;
      }
    };
  };
  return new EnterpriseRoleModel();
});