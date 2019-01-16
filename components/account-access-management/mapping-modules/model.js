define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var MappingModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf ExclusionModel~ExclusionModel
     */
    var Model = function() {
        this.transactionMapping = {
          accountNumber: "",
          selectedTransactions: []
        };
      },
      /**
       * This function fires batch of set of request
       * @params {deferred} - object to trach completion of Batch call
       * {batchData} - payload of batch service
       * @function fireBatch
       * @memberOf ExclusionModel
       **/
      fireBatchDeferred, fireBatch = function(batchData, deferred) {
        var options = {
          headers: {
            "BATCH_ID": ((Math.random() * 1000000000000) + 1).toString()
          },
          url: "batch/",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {}, batchData);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      fireBatch: function(batchData) {
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, fireBatchDeferred);
        return fireBatchDeferred;
      }
    };
  };
  return new MappingModel();
});