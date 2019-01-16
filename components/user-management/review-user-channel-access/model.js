define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ReviewUserChannelAccessModel = function() {
    var baseService = BaseService.getInstance();
    var deleteUserDeferred, deleteUser = function(username, userChannelAccessFlag, deferred) {
      var url = "users/" + username + "/grant";
      if (userChannelAccessFlag.toUpperCase() === "REVOKED") {
        url = "users/" + username + "/revoke";
      }
      var params = {
          "userId": username
        },
        options = {
          url: url,
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
      deleteUser: function(username, userChannelAccessFlag) {
        deleteUserDeferred = $.Deferred();
        deleteUser(username, userChannelAccessFlag, deleteUserDeferred);
        return deleteUserDeferred;
      }
    };
  };
  return new ReviewUserChannelAccessModel();
});
