define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-payments"
], function($, BaseService) {
  "use strict";
  var internalPayeeModel = function() {
    var

      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      getTransferPurposeDeferred, getTransferPurpose = function(deferred) {
        var options = {
          url: "purposes/linkages?taskCode=PC_F_INTRNL",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        /*,params = {
                'payeeType'   :'INTERNALFT'
            };*/
        baseService.fetch(options);
      },
      getRepeatDeferred, getRepeateIntervals = function(deferred) {
        var options = {
          url: "enumerations/paymentFrequency",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.resolve(data);
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
      };
    return {
      getTransferPurpose: function() {
        getTransferPurposeDeferred = $.Deferred();
        getTransferPurpose(getTransferPurposeDeferred);
        return getTransferPurposeDeferred;
      },
      getTransferData: function(paymentId, param1, param2, date) {
        getTransferDataDeferred = $.Deferred();
        getTransferData(paymentId, param1, param2, date, getTransferDataDeferred);
        return getTransferDataDeferred;
      },
      getRepeateIntervals: function() {
        getRepeatDeferred = $.Deferred();
        getRepeateIntervals(getRepeatDeferred);
        return getRepeatDeferred;
      }
    };
  };
  return new internalPayeeModel();
});