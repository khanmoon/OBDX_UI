define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserIdRecoveryInfoModel = function() {
    var baseService = BaseService.getInstance(),
      userIdRecoveryRequestDeferred, userIdRecoveryRequest = function(payload, deferred) {
        var options = {
          url: "credentials/forgotUserId",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.add(options);
      };
      var sessionRequestDeferred,sessionRequest = function(deferred) {
        var options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      };
      var nonceRequestDeferred,nonceRequest = function(deferred) {
        var options = {
          url: "session/nonce",
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
      userIdRecoveryRequest: function(uId) {
        userIdRecoveryRequestDeferred = $.Deferred();
        userIdRecoveryRequest(uId, userIdRecoveryRequestDeferred);
        return userIdRecoveryRequestDeferred;
      },
      sessionRequest: function() {
        sessionRequestDeferred = $.Deferred();
        sessionRequest(sessionRequestDeferred);
        return sessionRequestDeferred;
      },
      nonceRequest: function() {
        nonceRequestDeferred = $.Deferred();
        nonceRequest(nonceRequestDeferred);
        return nonceRequestDeferred;
      }
    };
  };
  return new UserIdRecoveryInfoModel();
});
