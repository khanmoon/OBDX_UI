define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var GeneratePinModel = function() {
    var creditCardValidationRequest = function() {

        this.expiryMonth = null;
        this.expiryYear = null;
        this.cvv = null;

      },
      pinRequest = function() {
        this.pin = null;
        this.dob = null;
      };
    var params, baseService = BaseService.getInstance();
    var validateCardDetailsDeferred, validateCardDetails = function(payload, serviceUrl, deferred) {
        var options = {
          url: serviceUrl,
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      resetPinDeferred, resetPin = function(payload, serviceUrl, deferred) {
        var options = {
          url: serviceUrl,
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options, params);
      };
    return {
      getNewValidationModel: function() {
        return new creditCardValidationRequest();
      },
      getNewPinResetModel: function() {
        return new pinRequest();
      },
      validateCardDetails: function(payload, url) {
        validateCardDetailsDeferred = $.Deferred();
        validateCardDetails(payload, url, validateCardDetailsDeferred);
        return validateCardDetailsDeferred;
      },
      resetPin: function(payload, url) {
        resetPinDeferred = $.Deferred();
        resetPin(payload, url, resetPinDeferred);
        return resetPinDeferred;
      }
    };
  };
  return new GeneratePinModel();
});