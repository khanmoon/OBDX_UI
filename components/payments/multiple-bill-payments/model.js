define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var MultipleBillPaymentsModel = function() {
    var Model = function() {
        this.autoPopulationData = {
          billerId: null,
          overviewDetails: null,
          showPaymentOverview: false,
          txnFailed: false,
          failureReason: null,

          payBillModel: {
            amount: {
              currency: null,
              amount: null
            },
            valueDate: null,
            userReferenceNo: "",
            remarks: "",
            purpose: "",
            debitAccountId: {
              displayValue: null,
              value: null
            },
            status: null,
            billerId: null,
            billNumber: null,
            billDate: null,
            consumerNumber: null,
            relationshipNumber: null
          }

        };

      },
      baseService = BaseService.getInstance(),
      fireBatchDeferred, fireBatch = function(deferred, batchRequest, type) {
        var options = {
          url: "batch",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {
          type: type
        }, batchRequest);
      };
    return {

      getNewModel: function() {
        return new Model();
      },
      fireBatch: function(batchRequest, type) {
        fireBatchDeferred = $.Deferred();
        fireBatch(fireBatchDeferred, batchRequest, type);
        return fireBatchDeferred;
      }
    };
  };
  return new MultipleBillPaymentsModel();
});