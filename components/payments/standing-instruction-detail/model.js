define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var standingInstructionDetailModel = function() {

    var baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      externalRefId,
      getStandingInstructionDetailsDeferred, getStandingInstructionDetails = function(deferred) {

        var options = {
            url: "payments/instructions/{externalReferenceId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "externalReferenceId": externalRefId
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
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      verifyCancelSIDeferred, verifyCancelSI = function(deferred, payload) {
        var options = {
            url: "payments/instructions/cancellation/{externalReferenceId}",
            data: payload,
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "externalReferenceId": externalRefId
          };
        baseService.add(options, params);
      },
      confirmCancelSIDeferred, confirmCancelSI = function(deferred) {
        var options = {
            url: "payments/instructions/cancellation/{externalReferenceId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            "externalReferenceId": externalRefId
          };
        baseService.patch(options, params);

      };

    return {
      /*
       *
       * Method to initialize the described model
       */
      init: function(externalReferenceId) {
        externalRefId = externalReferenceId;
      },
      getStandingInstructionDetails: function() {
        getStandingInstructionDetailsDeferred = $.Deferred();
        getStandingInstructionDetails(getStandingInstructionDetailsDeferred);
        return getStandingInstructionDetailsDeferred;
      },
      getPurposeDesc: function() {
        getPurposeDescDeferred = $.Deferred();
        getPurposeDesc(getPurposeDescDeferred);
        return getPurposeDescDeferred;
      },
      verifyCancelSI: function(payload) {
        verifyCancelSIDeferred = $.Deferred();
        verifyCancelSI(verifyCancelSIDeferred, payload);
        return verifyCancelSIDeferred;
      },
      confirmCancelSI: function() {
        confirmCancelSIDeferred = $.Deferred();
        confirmCancelSI(confirmCancelSIDeferred);
        return confirmCancelSIDeferred;
      }
    };
  };
  return new standingInstructionDetailModel();
});