define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ChangePasswordModel = function() {
    var Model = function() {
        this.oldPassword = null;
        this.newPassword = null;
        this.userId = null;
      },
      baseService = BaseService.getInstance(),
      changePasswordDeferred,
      changePassword = function(payload, deferred) {
        var options = {
          url: "me/forceChangePassword",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.update(options);
      };
    var fetchPasswordPolicyDeferred, fetchPasswordPolicy = function(searchParams, deferred) {
      var options = {
        url: "me/passwordPolicy?userId=" + searchParams.userId,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
    var logOut = function(callback) {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("logout");
      }
      var options = {
        url: "session",
        success: function() {
          callback();
        }
      };
      baseService.remove(options);
    };
    var logOutDBAuth = function() {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("logout");
      }
      var options = {
        url: "session",
        success: function() {
          window.location.href = window.location.origin + "/index.html?module=login";
        }
      };
      baseService.remove(options);
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
      fetchPasswordPolicy: function(params) {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(params, fetchPasswordPolicyDeferred);
        return fetchPasswordPolicyDeferred;
      },
      logOut: function(callback) {
        return logOut(callback);
      },
      logOutDBAuth: function() {
        return logOutDBAuth();
      }
    };
  };
  return new ChangePasswordModel();
});
