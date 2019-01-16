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
      },
      getNonceForceDeferred, getNonceForce = function(deferred) {
        var options = {
          url: "session/nonce",
          headers: {
            "x-noncecount": 10
          },
          complete: function(jqXHR) {
            if (jqXHR.status === 200) {
              deferred.resolve(jqXHR);
            } else {
              deferred.reject(jqXHR);
            }
          }
        };
        baseService.add(options);
      },
      meDeferred, me = function(deferred, payload) {
        var options = {
          url: "me",
          throttle: false,
          nonceRequired: true,
          headers: {
            "X-Target-Unit": ""
          },
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        if (payload) {
          options.headers = $.extend({}, options.headers, payload);
        }
        baseService.fetch(options);
      },
      getJwtTokenDeferred, getJwtToken = function(deferred, payload) {
        var options = {
          url: "jwt",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.add(options);
      };
    return {
      getMePreference: function() {
        var options = {
          url: "me/preferences"
        };
        return baseService.fetch(options);
      },
      updateMePreference: function(payload) {
        var options = {
          data: payload,
          url: "me/preferences"
        };
        return baseService.update(options);
      },
      sessionCreate: function() {
        return baseService.add({
          url: "session",
          method: "POST",
          data: ""
        });
      },
      updateSession: function() {
        return baseService.remove({
          url: "session"
        }).then(function() {
          baseService.invalidateNonce();
          return baseService.add({
            url: "session",
            method: "POST",
            data: ""
          });
        });
      },
      validateDevice: function() {
        validateDeviceDeferred = $.Deferred();
        validateDevice(validateDeviceDeferred);
        return validateDeviceDeferred;
      },
      registerDevice: function(payload) {
        registerDeviceDeferred = $.Deferred();
        registerDevice(registerDeviceDeferred, payload);
        return registerDeviceDeferred;
      },
      getNonceForce: function() {
        getNonceForceDeferred = $.Deferred();
        getNonceForce(getNonceForceDeferred);
        return getNonceForceDeferred;
      },
      me: function(payload) {
        meDeferred = $.Deferred();
        me(meDeferred, payload);
        return meDeferred;
      },
      getJwtToken: function(payload) {
        getJwtTokenDeferred = $.Deferred();
        getJwtToken(getJwtTokenDeferred, payload);
        return getJwtTokenDeferred;
      }
    };
  };

  return new loginFormModel();
});
