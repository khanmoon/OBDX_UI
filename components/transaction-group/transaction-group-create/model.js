/**


 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TransactionGroupCreateModel = function() {
    var baseService = BaseService.getInstance(),
    /**
     * Method to create Transaction Group
     *  deferred object is resolved once the  information  is successfully fetched
     *
     * @function createTransactionGroup
     * @param {string} payload- for creating Transaction Group
     * @param {oject} deferred- resolved for successful request
     * @private
     */
      createTransactionGroupDeferred, createTransactionGroup = function(payload, deferred) {
        var options = {
          url: "taskGroups",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      };

    return {
      /**
       * fetchTransactionList - fetches the Task Group list
       * @returns {Promise}  Returns the promise object
       */
      fetchTransactionList: function() {
        var options = {
          url: "resourceTasks?aspects=limit&view=list"
        };
        return baseService.fetch(options);
      },
      createTransactionGroup: function(payload) {
        createTransactionGroupDeferred = $.Deferred();
        createTransactionGroup(payload, createTransactionGroupDeferred);
        return createTransactionGroupDeferred;
      }
    };
  };
  return new TransactionGroupCreateModel();
});
