define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var headerModel = function() {
    var baseService = BaseService.getInstance(),
      logOut = function() {
        var options = {
          url: "session",
          success: function() {
            var form = document.createElement("form");
            form.action = "/logout.";
            document.body.appendChild(form);
            form.submit();
          }
        };
        baseService.remove(options);
      },
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
      logOut: function() {
        logOut();
      },
      checkLoginStatus: function() {
        checkLoginStatusDeferred = $.Deferred();
        checkLoginStatus(checkLoginStatusDeferred);
        return checkLoginStatusDeferred;
      }
    };
  };
  return new headerModel();
});