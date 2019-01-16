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
    return {
      userIdRecoveryRequest: function(uId) {
        userIdRecoveryRequestDeferred = $.Deferred();
        userIdRecoveryRequest(uId, userIdRecoveryRequestDeferred);
        return userIdRecoveryRequestDeferred;
      }
    };
  };
  return new UserIdRecoveryInfoModel();
});