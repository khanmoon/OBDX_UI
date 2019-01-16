define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var loginFormModel = function loginFormModel() {

    var baseService = BaseService.getInstance();

    var validateDeviceDeferred, validateDevice = function(deferred) {
        var options = {
          url: "mobileClient/validateDevice",
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.update(options);
      },
      registerDeviceDeferred, registerDevice = function(deferred, payload) {
        var options = {
          url: "mobileClient",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.add(options);
      };
    return {
      validateDevice: function() {
        validateDeviceDeferred = $.Deferred();
        validateDevice(validateDeviceDeferred);
        return validateDeviceDeferred;
      },
      registerDevice: function(payload) {
        registerDeviceDeferred = $.Deferred();
        registerDevice(registerDeviceDeferred, payload);
        return registerDeviceDeferred;
      }
    };
  };

  return new loginFormModel();
});
