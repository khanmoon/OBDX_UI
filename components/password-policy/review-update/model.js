define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var ReviewPasswordPolicyUpdateModel = function() {
    var Deferred, get = function(deferred) {
      var options = {
        url : "enter-url-here/",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var updatePasswordPolicyDeferred, updatePasswordPolicy = function(id, payload, deferred) {
        var options = {
          url: "passwordPolicy/" + id,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
      },
      /**
               * This function fires a GET request to fetch the user groups options
               * and delegates control to the successhandler along with response data
               * once the details are successfully fetched
               *
               * @function fetchUserGroupOptions
               * @memberOf ReviewPasswordPolicyUpdateModel

               * @example ReviewPasswordPolicyUpdateModel.fetchUserGroupOptions();
               */
      fetchUserGroupOptionsDeferred, fetchUserGroupOptions = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
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
      get: function() {
        Deferred = $.Deferred();
        get(Deferred);
        return Deferred;
      },
      updatePasswordPolicy: function(id, payload) {
        updatePasswordPolicyDeferred = $.Deferred();
        updatePasswordPolicy(id, payload, updatePasswordPolicyDeferred);
        return updatePasswordPolicyDeferred;
      },
      fetchUserGroupOptions: function() {
        fetchUserGroupOptionsDeferred = $.Deferred();
        fetchUserGroupOptions(fetchUserGroupOptionsDeferred);
        return fetchUserGroupOptionsDeferred;
      }
    };
  };
  return new ReviewPasswordPolicyUpdateModel();
});