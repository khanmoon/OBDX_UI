define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AccountNumberDebitCardModel = function() {
    var baseService = BaseService.getInstance(),
      accountNumberDeferred,
      /**
       * Private method to fetch the severity levels created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getAccountNumberData
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      getAccountNumberData = function(deferred) {
        var options = {
          url: "accounts/demandDeposit",
          success: function(status, jqXhr) {
            deferred.resolve(status, jqXhr);
          },
          error: function(status, jqXhr) {
            deferred.reject(status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      debitCardNumberDeferred,
      /**
       * Private method to fetch the severity levels created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getDebitCardNumberData
       * @memberOf ErrorModel
       * @param {String} account - An object type deferred
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      getDebitCardNumberData = function(account, deferred) {
        var options = {
            url: "accounts/demandDeposit/{account}/debitCards",
            success: function(status, jqXhr) {
              deferred.resolve(status, jqXhr);
            },
            error: function(status, jqXhr) {
              deferred.reject(status, jqXhr);
            }
          },
          params = {
            "account": account
          };
        baseService.fetch(options, params);
      };
    return {
      /**
       * Public method to fetch list of account numbers. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getAccountNumberData
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       AccountNumberDebitCardModel.getAccountNumberData().done(function(data) {
       *
       *       });
       */
      getAccountNumberData: function() {
        accountNumberDeferred = $.Deferred();
        getAccountNumberData(accountNumberDeferred);
        return accountNumberDeferred;
      },
      /**
       * Public method to fetch list of applicable debit cards. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getDebitCardNumberData
       * @memberOf ServiceRequestsSearchModel
       * @param {String} account - Account number
       * @returns {Object} - deferredObject
       * @example
       *       AccountNumberDebitCardModel.getDebitCardNumberData(account).done(function(data) {
       *
       *       });
       */
      getDebitCardNumberData: function(account) {
        debitCardNumberDeferred = $.Deferred();
        getDebitCardNumberData(account, debitCardNumberDeferred);
        return debitCardNumberDeferred;
      }
    };
  };
  return new AccountNumberDebitCardModel();
});
