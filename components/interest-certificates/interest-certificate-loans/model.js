define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for loan account interest section in the interest certificate page. It serves as the model where the data to be used by the loan account interest section is defined.
   *
   * @namespace loansModel~Model
   * @class loansModel
   */
  var loansModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      fetchLoanInterestsDeferred,
      /**
       * Private method to get loan interests to be displayed on loan interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchLoanInterests
       * @memberOf loansModel
       * @param {String} accountId - account Id
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchLoanInterests = function(accountId, fromDate, toDate, deferred) {
        var parameters = {
          accountId: accountId,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/loan/{accountId}/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, parameters);
      },fetchLoanInterestsForAllDeferred,
      /**
       * Private method to get loan interests to be displayed on loan interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchLoanInterestsForAll
       * @memberOf loansModel
       * @param {String} taskCode - taskCode
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchLoanInterestsForAll = function(taskCode, fromDate, toDate, deferred) {
        var parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/loan/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}",
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
          url: "accounts/loan/{accountNo}/paidInterest?fromDate={fromDate}&toDate={toDate}&media=application/pdf",
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
          url: "accounts/loan/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}&media=application/pdf",
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
       * Private method to get loan interests to be displayed on loan interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchLoanInterests
       * @memberOf loansModel
       * @param {String} accountId -Account Id
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @return {type}          description
       * @example
       * loansModel.fetchLoanInterests().then(function (data) {
       *
       * });
       */

      fetchLoanInterests: function(accountId, fromDate, toDate) {
        fetchLoanInterestsDeferred = $.Deferred();
        fetchLoanInterests(accountId, fromDate, toDate, fetchLoanInterestsDeferred);
        return fetchLoanInterestsDeferred;
      },

      /**
       * Private method to get loan interests to be displayed on loan interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchLoanInterestsForAll
       * @memberOf loansModel
       * @param {String} taskCode -Task Code
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @return {type}          description
       * @example
       * loansModel.fetchLoanInterestsForAll().then(function (data) {
       *
       * });
       */

      fetchLoanInterestsForAll: function(taskCode, fromDate, toDate) {
        fetchLoanInterestsForAllDeferred = $.Deferred();
        fetchLoanInterestsForAll(taskCode, fromDate, toDate, fetchLoanInterestsForAllDeferred);
        return fetchLoanInterestsForAllDeferred;
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
  return new loansModel();
});
