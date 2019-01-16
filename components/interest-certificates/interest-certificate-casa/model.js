define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for Demand Deposit account interest section in the interest certificate page. It serves as the model where the data to be used by the demand deposit account interest section is defined.
   *
   * @namespace DDAModel~Model
   * @class DDAModel
   */
  var DDAModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      fetchDDAInterestsDeferred,
      /**
       * Private method to get demand deposit interests to be displayed on interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDDAInterests
       * @memberOf DDAModel
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {String} accountId accountId
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchDDAInterests = function(fromDate, toDate, accountId, deferred) {
          var parameters = {
          accountId: accountId,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/demandDeposit/{accountId}/interest?fromDate={fromDate}&toDate={toDate}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, parameters);
      },
      fetchDDAInterestsForAllDeferred,
      /**
       * Private method to get demand deposit interests to be displayed on interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDDAInterestsForAll
       * @memberOf DDAModel
       * @param {String} taskCode - Task Code
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchDDAInterestsForAll = function(taskCode, fromDate, toDate, deferred) {
          var parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/demandDeposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, parameters);
      },
      fetchPDFDeferred,
      /**
       * fetchPDF - description
       *
       * @param  {type} accountNo description
       * @param  {type} fromDate  description
       * @param  {type} toDate    description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      fetchPDF = function(accountNo, fromDate, toDate, deferred) {
        var parameters = {
          accountNo: accountNo,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/demandDeposit/{accountNo}/interest?fromDate={fromDate}&toDate={toDate}&media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.downloadFile(options, parameters);
      },
      fetchPDFForAllDeferred,
      /**
       * fetchPDFForAll - description
       *
       * @param  {type} taskCode description
       * @param  {type} fromDate  description
       * @param  {type} toDate    description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      fetchPDFForAll = function(taskCode, fromDate, toDate, deferred) {
        var parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/demandDeposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}&media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.downloadFile(options, parameters);
      },
      fetchCurrentDateDeferred,

      /**
       * fetchCurrentDate - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      fetchCurrentDate = function(deferred) {
        var options = {
          url: "payments/currentDate",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      /**
       * Private method to get demand deposit interests to be displayed on interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDDAInterests
       * @memberOf DDAModel
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {String} accountId accountId
       * @return {type}          description
       * @example
       * DDAModel.fetchDDAInterests().then(function (data) {
       *
       * });
       */
      fetchDDAInterests: function(fromDate, toDate, accountId) {
        fetchDDAInterestsDeferred = $.Deferred();
        fetchDDAInterests(fromDate, toDate, accountId, fetchDDAInterestsDeferred);
        return fetchDDAInterestsDeferred;
      },
      /**
       * Private method to get demand deposit interests to be displayed on interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDDAInterestsForAll
       * @memberOf DDAModel
       * @param {String} taskCode Task Code
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @return {type}          description
       * @example
       * DDAModel.fetchDDAInterestsForAll().then(function (data) {
       *
       * });
       */
      fetchDDAInterestsForAll: function(taskCode, fromDate, toDate) {
        fetchDDAInterestsForAllDeferred = $.Deferred();
        fetchDDAInterestsForAll(taskCode, fromDate, toDate, fetchDDAInterestsForAllDeferred);
        return fetchDDAInterestsForAllDeferred;
      },
      /**
       * fetchPDF - description
       *
       * @param  {type} accountNo description
       * @param  {type} fromDate  description
       * @param  {type} toDate    description
       * @return {type}           description
       */
      fetchPDF: function(accountNo, fromDate, toDate) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(accountNo, fromDate, toDate, fetchPDFDeferred);
        return fetchPDFDeferred;
      },
      /**
       * fetchPDFForAll - description
       *
       * @param  {type} taskCode description
       * @param  {type} fromDate  description
       * @param  {type} toDate    description
       * @return {type}           description
       */
      fetchPDFForAll: function(taskCode, fromDate, toDate) {
        fetchPDFForAllDeferred = $.Deferred();
        fetchPDFForAll(taskCode, fromDate, toDate, fetchPDFForAllDeferred);
        return fetchPDFForAllDeferred;
      },
      /**
       * fetchCurrentDate - description
       *
       * @return {type}  description
       */
      fetchCurrentDate: function() {
        fetchCurrentDateDeferred = $.Deferred();
        fetchCurrentDate(fetchCurrentDateDeferred);
        return fetchCurrentDateDeferred;
      }
    };
  };
  return new DDAModel();
});
