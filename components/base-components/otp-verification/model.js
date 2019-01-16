define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * This file contains all the REST services APIs for the otp-verification component.
   *
   * @class OTPverificationModel
   * @extends BaseService {@link BaseService}
   * @property {Object} baseService - baseService instance through which all the rest calls will be made.
   */
  var OTPverificationModel = function() {
    var baseService = BaseService.getInstance(),
      /**
       * This function uses baseService's update to UPDATE the data for otp verification.
       * @function submitOTP
       * @param {String} baseUrl - String indicating the URL for which the details are to be updated.
       * @param {String} code - String representing OTP entered by the user.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      submitOTPDeferred, submitOTP = function(baseUrl, code, deferred) {
        var options = {
          url: baseUrl + "/authentication",
          headers: {
            "TOKEN_ID": code
          },
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      /**
       * This function uses baseService's patch method to resend OTP to the user.
       * @function resendOTP
       * @param {String} baseUrl - String indicating the URL for which request is to be fired.
       * @param {Object} deferred - deferred object being passed which handles resolution or rejection of data.
       */
      resendOTPDeferred, resendOTP = function(baseUrl, deferred) {
        var options = {
          url: baseUrl,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.patch(options);
      };
    return {
      submitOTP: function(baseUrl, code) {
        submitOTPDeferred = $.Deferred();
        submitOTP(baseUrl, code, submitOTPDeferred);
        return submitOTPDeferred;
      },
      resendOTP: function(baseUrl) {
        resendOTPDeferred = $.Deferred();
        resendOTP(baseUrl, resendOTPDeferred);
        return resendOTPDeferred;
      }
    };
  };
  return new OTPverificationModel();
});