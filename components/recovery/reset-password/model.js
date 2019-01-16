define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ResetPasswordModel = function() {
    var Model = function() {
        this.userId=null;
        this.newPassword=null;
        this.registrationId=null;
      },
      baseService = BaseService.getInstance(),
      changePasswordDeferred, fetchPasswordPolicyDeferred, changePassword = function(payload, deferred) {
        var options = {
          url: "credentials/changeCredentials",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      };
    var fetchPasswordPolicy = function(deferred) {
      var options = {
        url: "passwordPolicy?display=true",
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
      getNewModel: function() {
        return new Model();
      },
      changePassword: function(payload) {
        changePasswordDeferred = $.Deferred();
        changePassword(payload, changePasswordDeferred);
        return changePasswordDeferred;
      },
      fetchPasswordPolicy: function() {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(fetchPasswordPolicyDeferred);
        return fetchPasswordPolicyDeferred;
      }
    };
  };
  return new ResetPasswordModel();
});
