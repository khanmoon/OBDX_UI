define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TransactionSeclectionModel = function() {
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
          accountNumber: {
            displayValue: "",
            value: "",
            accountStatus: ""
          },
          selectedTask: [],
          accountType: "",
          nonSelectedTask: []
        };
      },
      fetchKeysDeferred, fetchKeys = function(deferred) {
        var options = {
          url: "accountAccess/transactionList",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetchJSON(options);
      },
      fetchGroupingDataDeferred,
      fetchGroupingData = function(deferred) {
        var options = {
          url: "accountAccess/transactionGrupList",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetchJSON(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      fetchKeys: function() {
        fetchKeysDeferred = $.Deferred();
        fetchKeys(fetchKeysDeferred);
        return fetchKeysDeferred;
      },
      fetchGroupingData: function() {
        fetchGroupingDataDeferred = $.Deferred();
        fetchGroupingData(fetchGroupingDataDeferred);
        return fetchGroupingDataDeferred;
      }
    };
  };
  return new TransactionSeclectionModel();
});