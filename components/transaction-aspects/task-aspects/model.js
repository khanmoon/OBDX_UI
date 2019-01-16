define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";
  var TransactionAspectsModel = function() {
    var Model = function() {
      this.payload = {
        "aspects": []
      };
    };
    var baseService = BaseService.getInstance(),
      getTransactionsDeferred, getTransactions = function(deferred) {
        var options = {
          url: "resourceTasks?view=list",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      searchTransactionsDeffered, searchTransactions = function(deferred, taskID) {
        var params = {
            "taskId": taskID
          },
          options = {
            url: "resourceTasks/{taskId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };

        baseService.fetch(options, params);

      },
      setTaskAspectsDeferred, setTaskAspects = function(taskId, payload, deferred) {
        var params = {
            "taskId": taskId
          },
          options = {
            url: "resourceTasks/{taskId}",
            data: payload,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.patch(options, params);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getTransactions: function() {
        getTransactionsDeferred = $.Deferred();
        getTransactions(getTransactionsDeferred);
        return getTransactionsDeferred;
      },
      searchTransactions: function(taskId) {
        searchTransactionsDeffered = $.Deferred();
        searchTransactions(searchTransactionsDeffered, taskId);
        return searchTransactionsDeffered;
      },
      setTaskAspects: function(roleId, payload) {
        setTaskAspectsDeferred = $.Deferred();
        setTaskAspects(roleId, payload, setTaskAspectsDeferred);
        return setTaskAspectsDeferred;
      }
    };
  };
  return new TransactionAspectsModel();
});