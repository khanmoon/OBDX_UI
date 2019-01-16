define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var productHomeModel = function() {
    var baseService = BaseService.getInstance(),
      checkLoginStatusDeferred, checkLoginStatus = function(deferred) {
        var options = {
          showMessage: false,
          url: "me",
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
      checkLoginStatus: function() {
        checkLoginStatusDeferred = $.Deferred();
        checkLoginStatus(checkLoginStatusDeferred);
        return checkLoginStatusDeferred;
      }
    };
  };
  return new productHomeModel();
});