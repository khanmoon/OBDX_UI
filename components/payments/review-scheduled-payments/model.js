/*global define, console,*/
define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";

  var reviewScheduledPaymentsInfoModel = function() {

    var

      modelInitialized = false,

      baseService = BaseService.getInstance(),

      readCancelSIDeferred,
      readCancelSI = function(id, deferred) {
        var options = {
            url: "payments/instructions?externalReferenceId={externalReferenceId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            externalReferenceId: id

          };
        baseService.fetch(options, params);
      },
      getPurposeDescDeferred, getPurposeDesc = function(deferred) {
        var options = {
          url: "purposes/PC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.resolve(data);
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
      };
    return {

      init: function() {

        modelInitialized = true;

        return modelInitialized;
      },

      readCancelSI: function(refId) {
        objectInitializedCheck();
        readCancelSIDeferred = $.Deferred();
        readCancelSI(refId, readCancelSIDeferred);
        return readCancelSIDeferred;
      },
      getPurposeDesc: function() {

        getPurposeDescDeferred = $.Deferred();
        getPurposeDesc(getPurposeDescDeferred);
        return getPurposeDescDeferred;
      }

    };
  };
  return new reviewScheduledPaymentsInfoModel();
});