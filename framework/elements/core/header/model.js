define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var headerModel = function() {
    var params, baseService = BaseService.getInstance(),
      logOut = function(callback) {
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
      },
      logOutDBAuth = function() {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage("logout");
        }
        var options = {
          url: "session",
          success: function() {
            window.location.href = window.location.origin + "/pages/home.html?module=login";
          }
        };
        baseService.remove(options);
      },
      showLoginTimeDeferred, showLoginTime = function(deferred) {
        var options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getMailCountDeferred, getMailCount = function(deferred) {
        var options = {
          url: "mailbox/count",
          selfLoader: true,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      logOut: function(callback) {
        logOut(callback);
      },
      logOutDBAuth: function() {
        logOutDBAuth();
      },
      showLoginTime: function() {
        showLoginTimeDeferred = $.Deferred();
        showLoginTime(showLoginTimeDeferred);
        return showLoginTimeDeferred;
      },
      getMailCount: function() {
        getMailCountDeferred = $.Deferred();
        getMailCount(getMailCountDeferred);
        return getMailCountDeferred;
      },
      /**
       * helpDeskSessionRead - Reads help desk session
       * @param {Object} sessionKey  - session key stored in header
       * @returns {Promise}  Returns the promise object
       */
      helpDeskSessionRead: function(sessionKey) {
        params = {
          "sessionKey": sessionKey
        };
        var options = {
          url: "helpDeskSession/{sessionKey}"
        };
        return baseService.fetch(options, params);
      },
      /**
       * helpDeskSessionOut - Deletes help desk session
       * @param {Object} payload  - payload for help desk session deletion.
       * @returns {Promise}  Returns the promise object
       */
      helpDeskSessionOut: function(payload) {
        var options = {
          url: "helpDeskSession",
          data: payload
        };
        return baseService.update(options);
      }
    };
  };
  return new headerModel();
});
