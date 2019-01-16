/**


 */
define([
      "jquery",
      "baseService"
    ], function($, BaseService) {
      "use strict";
      var TransactionGroupReadModel = function() {
        var baseService = BaseService.getInstance(),
        /**
         * Method to delete Transaction Group
         *  deferred object is resolved once the  information  is successfully fetched
         *
         * @function deleteTransactionGroup
         * @param {string} transactionGroupId- transactionGroupId for creating Transaction Group
         * @param {oject} deferred- resolved for successful request
         * @private
         */
          deleteTransactionGroupDeferred, deleteTransactionGroup = function(transactionGroupId, deferred) {
            var params = {
                "taskGroupId": transactionGroupId
              },
              options = {
                url: "taskGroups/{taskGroupId}",
                success: function(data, status, jqXhr) {
                  deferred.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                  deferred.reject(data, status, jqXhr);
                }
              };
            baseService.remove(options, params);
          };
        return {
          /**
           * readTransactionGroup - reads the Transaction group
           * @param  {String} transactionGroupId Transaction Group Id for Transaction group
           * @returns {Promise}  Returns the promise object
           */
          readTransactionGroup: function(transactionGroupId) {
            var params = {
                "taskGroupId": transactionGroupId
              },
              options = {
                url: "taskGroups/{taskGroupId}"
              };
            return baseService.fetch(options,params);
          },
          deleteTransactionGroup: function(transactionGroupId) {
            deleteTransactionGroupDeferred = $.Deferred();
            deleteTransactionGroup(transactionGroupId, deleteTransactionGroupDeferred);
            return deleteTransactionGroupDeferred;
          }
        };
      };
        return new TransactionGroupReadModel();
      });
