define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-payments"
], function($, BaseService) {
  "use strict";

  var standingInstructionModel = function() {

    var Model = function() {

        this.standingInstructionCancelModel = {
          instructionType: "REC"
        };

      },

      modelInitialized = false,

      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      getTransferPurposeDeferred, getPurpose = function(paymentType, deferred) {
        var url;
        if (paymentType === "INTERNALFT_SI") {
          url = "purposes/linkages?taskCode=PC_F_INTRNL";
        } else if (paymentType === "DOMESTICFT_SI" || paymentType === "INDIADOMESTICFT_SI" || paymentType === "UKDOMESTICFT_SI" || paymentType === "SEPADOMESTICFT_SI") {
          url = "purposes/linkages?taskCode=PC_F_DOM";
        }
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },

      errors = {
        InitializationException: (function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()),

        ObjectNotInitialized: (function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }())
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      },

      getSIListDeferred,
      getSIList = function(deferred) {

        var options = {
          url: "payments/instructions?status=ACTIVE&type=REC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);

      };

    return {

      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },

      getNewModel: function(modelData) {
        return new Model(modelData);
      },

      getSIList: function() {
        objectInitializedCheck();
        getSIListDeferred = $.Deferred();
        getSIList(getSIListDeferred);
        return getSIListDeferred;
      },

      getTransferPurpose: function(paymentType) {
        objectInitializedCheck();
        getTransferPurposeDeferred = $.Deferred();
        getPurpose(paymentType, getTransferPurposeDeferred);
        return getTransferPurposeDeferred;
      }
    };
  };
  return new standingInstructionModel();
});