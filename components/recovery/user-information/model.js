define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var UserInformationModel = function() {
    var baseService = BaseService.getInstance(),
      updatePasswordRequestDeferred, updatePasswordRequest = function(payload, deferred) {
        var options = {
          url: "credentials/forgotCredentials",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.add(options);
      };
    return {
      updatePasswordRequest: function(uId) {
        updatePasswordRequestDeferred = $.Deferred();
        updatePasswordRequest(uId, updatePasswordRequestDeferred);
        return updatePasswordRequestDeferred;
      }
    };
  };
  return new UserInformationModel();
});
