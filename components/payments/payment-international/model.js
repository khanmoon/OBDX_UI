define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var InternationalPaymentModel = function() {
    var modelInitialized = false,
      baseService = BaseService.getInstance(),
      getCorrespondenceChargesDeferred, getCorrespondenceCharges = function(deferred) {
        var options = {
          url: "enumerations/correspondanceChargeType",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getTransferDataDeferred, getTransferData = function(paymentId, param1, param2, date, deferred) {
        var url;
        if (date === "now") {
          url = "payments/{paymentType}/{transferType}/{paymentId}";
        } else {
          url = "payments/instructions/{paymentType}/{transferType}/{paymentId}";
        }
        var options = {
            url: url,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            paymentType: param1,
            transferType: param2,
            paymentId: paymentId
          };
        baseService.fetch(options, params);
      },
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
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

      getCorrespondenceCharges: function() {
        objectInitializedCheck();
        getCorrespondenceChargesDeferred = $.Deferred();
        getCorrespondenceCharges(getCorrespondenceChargesDeferred);
        return getCorrespondenceChargesDeferred;
      },
      getTransferData: function(paymentId, param1, param2, date) {
        objectInitializedCheck();
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, param1, param2, date, getTransferDataDeferred);
        return getTransferDataDeferred;
      }
    };
  };
  return new InternationalPaymentModel();
});