define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var loginOptions = function() {
    var createLoginConfigDeferred, createLoginConfig = function(payload, deferred) {
      var options = {
        url: "me/loginFlow",
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
    return {
      createLoginConfig: function(payload) {
        createLoginConfigDeferred = $.Deferred();
        createLoginConfig(payload, createLoginConfigDeferred);
        return createLoginConfigDeferred;
      }
    };
  };
  return new loginOptions();
});