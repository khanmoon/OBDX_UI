define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SecuritycodeModel = function() {
    var Model = function() {
        this.securitycodeVerificationModel = {
          "securityCode": "",
          "aliasType": "",
          "aliasValue": ""
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      verifySecurityCodeDeferred, verifySecurityCode = function(payload, deferred) {
        var options = {
          url: "payments/transfers/peerToPeer/receiverValidation",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      verifySecurityCode: function(payload) {
        objectInitializedCheck();
        verifySecurityCodeDeferred = $.Deferred();
        verifySecurityCode(payload, verifySecurityCodeDeferred);
        return verifySecurityCodeDeferred;
      }
    };
  };
  return new SecuritycodeModel();
});