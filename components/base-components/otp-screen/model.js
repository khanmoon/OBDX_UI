define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var params, baseService = BaseService.getInstance();
  var OTPModel = function() {
    var resendOTPDeferred, resendOTP = function(referenceNumber, deferred) {
      params = {
        "referenceNumber": referenceNumber
      };
      var options = {
        url: "2fa/{referenceNumber}/resend",
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(jqXHR) {
          deferred.reject(jqXHR);
        }
      };
      baseService.add(options, params);
    };
    return {
      resendOTP: function(referenceNumber) {
        resendOTPDeferred = $.Deferred();
        resendOTP(referenceNumber, resendOTPDeferred);
        return resendOTPDeferred;
      }
    };
  };
  return new OTPModel();
});