define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var ReviewUserStatusModel = function() {
    var baseService = BaseService.getInstance();
    var lockStatusDeferred, lockStatus = function(username, payload, deferred) {
      var params = {
          "userId": username
        },
        options = {
          url: "users/" + username + "/lock",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
      baseService.add(options, params);
    };
    var unlockStatusDeferred, unlockStatus = function(username, deferred) {
      var params = {
          "userId": username
        },
        options = {
          url: "users/" + username + "/unlock",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
      baseService.add(options, params);
    };
    return {
      lockStatus: function(username, payload) {
        lockStatusDeferred = $.Deferred();
        lockStatus(username, payload, lockStatusDeferred);
        return lockStatusDeferred;
      },
      unlockStatus: function(username) {
        unlockStatusDeferred = $.Deferred();
        unlockStatus(username, unlockStatusDeferred);
        return unlockStatusDeferred;
      }
    };
  };
  return new ReviewUserStatusModel();
});
