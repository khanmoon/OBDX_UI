define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var PasswordPolicySearchModel = function() {
    var listPasswordPolicyDeferred, listPasswordPolicy = function(searchParams, deferred) {
      var options = {
        url: "passwordPolicy?name={policyName}&description={policyDesc}&roles=administrator&roles=corporateuser&roles=retailuser",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, searchParams);
    };
    return {
      listPasswordPolicy: function(params) {
        listPasswordPolicyDeferred = $.Deferred();
        listPasswordPolicy(params, listPasswordPolicyDeferred);
        return listPasswordPolicyDeferred;
      }
    };
  };
  return new PasswordPolicySearchModel();
});