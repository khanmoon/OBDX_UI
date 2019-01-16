define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserCreationModel = function() {
    var Model = function() {
        this.username = null;
        this.password = null;
        this.registrationId = null;
      },
      baseService = BaseService.getInstance(),
      createLogInDeferred, fetchPasswordPolicyDeferred, createLogIn = function(registrationId, payload, deferred) {
        var options = {
          url: "registration/" + registrationId + "/credentials",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      };
    var fetchPasswordPolicy = function(deferred) {
      var options = {
        url: "passwordPolicy",
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
      createLogIn: function(registrationId, payload) {
        createLogInDeferred = $.Deferred();
        createLogIn(registrationId, payload, createLogInDeferred);
        return createLogInDeferred;
      },
      fetchPasswordPolicy: function() {
        fetchPasswordPolicyDeferred = $.Deferred();
        fetchPasswordPolicy(fetchPasswordPolicyDeferred);
        return fetchPasswordPolicyDeferred;
      }
    };
  };
  return new UserCreationModel();
});
