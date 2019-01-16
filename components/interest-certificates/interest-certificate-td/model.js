define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for deposit account interest section in the interest certificate page. It serves as the model where the data to be used by the deposit account interest section is defined.
   *
   * @namespace depositModel~Model
   * @class depositModel
   */
  var depositModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      fetchDepositInterestsDeferred,
      /**
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDepositInterests
       * @memberOf depositModel
       * @param {String} accountId - account Id
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {String} depositmodule deposit module
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchDepositInterests = function(accountId, fromDate, toDate, depositmodule, deferred) {
        var parameters = {
          accountId: accountId,
          fromDate: fromDate,
          toDate: toDate,
          depositmodule: depositmodule
        };
        var options = {
          url: "accounts/deposit/{accountId}/paidInterest?fromDate={fromDate}&toDate={toDate}&module={depositmodule}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, parameters);
      },fetchRDInterestsForAllDeferred,
      /**
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchRDInterestsForAll
       * @memberOf depositModel
       * @param {String} taskCode - task Code
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchRDInterestsForAll = function(taskCode, fromDate, toDate, deferred) {
        var parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/deposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}&module=RD",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, parameters);
      },fetchDepositInterestsForAllDeferred,
      /**
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDepositInterestsForAll
       * @memberOf depositModel
       * @param {String} taskCode - task Code
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchDepositInterestsForAll = function(taskCode, fromDate, toDate, deferred) {
        var parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/deposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}&module=CON&module=ISL",
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
       * @param  {type} accountNo     description
       * @param  {type} fromDate      description
       * @param  {type} toDate        description
       * @param  {type} depositmodule description
       * @param  {type} deferred      description
       * @return {type}               description
       */
      fetchPDF = function(accountNo, fromDate, toDate, depositmodule, deferred) {
        var parameters = {
          accountNo: accountNo,
          fromDate: fromDate,
          toDate: toDate,
          module: depositmodule
        };
        var options = {
          url: "accounts/deposit/{accountNo}/paidInterest?fromDate={fromDate}&toDate={toDate}&module={module}&media=application/pdf",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.downloadFile(options, parameters);
      },
      fetchRDPDFForAllDeferred,
      /**
       * fetchRDPDFForAll - description
       *
       * @param  {type} taskCode description
       * @param  {type} fromDate  description
       * @param  {type} toDate    description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      fetchRDPDFForAll = function(taskCode, fromDate, toDate, deferred) {
        var parameters = {
          taskCode: taskCode,
          fromDate: fromDate,
          toDate: toDate
        };
        var options = {
          url: "accounts/deposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}&media=application/pdf&module=RD",
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
          url: "accounts/deposit/paidInterest?fromDate={fromDate}&toDate={toDate}&taskCode={taskCode}&media=application/pdf&module=CON&module=ISL",
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
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDepositInterests
       * @memberOf depositModel
       * @param {String} accountId - account Id
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @param {String} depositmodule deposit module
       * @return {type}          description
       * @example
       * depositModel.fetchDepositInterests().then(function (data) {
       *
       * });
       */
      fetchDepositInterests: function(accountId, fromDate, toDate, depositmodule) {
        fetchDepositInterestsDeferred = $.Deferred();
        fetchDepositInterests(accountId, fromDate, toDate, depositmodule, fetchDepositInterestsDeferred);
        return fetchDepositInterestsDeferred;
      },
      /**
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDepositInterestsForAll
       * @memberOf depositModel
       * @param {String} taskCode - Task Code
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @return {type}          description
       * @example
       * depositModel.fetchDepositInterestsForAll().then(function (data) {
       *
       * });
       */
      fetchDepositInterestsForAll: function(taskCode, fromDate, toDate) {
        fetchDepositInterestsForAllDeferred = $.Deferred();
        fetchDepositInterestsForAll(taskCode, fromDate, toDate, fetchDepositInterestsForAllDeferred);
        return fetchDepositInterestsForAllDeferred;
      },
      /**
       * Private method to get deposit interests to be displayed on deposit interest certificate page.
       * This method will only be called if accountNo, fromDate and toDate are present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchRDInterestsForAll
       * @memberOf depositModel
       * @param {String} taskCode - Task Code
       * @param {String} fromDate from date
       * @param {String} toDate to date
       * @return {type}          description
       * @example
       * depositModel.fetchDepositInterestsForAll().then(function (data) {
       *
       * });
       */
      fetchRDInterestsForAll: function(taskCode, fromDate, toDate) {
        fetchRDInterestsForAllDeferred = $.Deferred();
        fetchRDInterestsForAll(taskCode, fromDate, toDate, fetchRDInterestsForAllDeferred);
        return fetchRDInterestsForAllDeferred;
      },
      /**
       * fetchPDF - description
       *
       * @param  {type} accountNo     description
       * @param  {type} fromDate      description
       * @param  {type} toDate        description
       * @param  {type} depositmodule description
       * @return {type}               description
       */
      fetchPDF: function(accountNo, fromDate, toDate, depositmodule) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(accountNo, fromDate, toDate, depositmodule, fetchPDFDeferred);
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
       * fetchRDPDFForAll - description
       *
       * @param  {type} taskCode description
       * @param  {type} fromDate  description
       * @param  {type} toDate    description
       * @return {type}           description
       */
      fetchRDPDFForAll: function(taskCode, fromDate, toDate) {
        fetchRDPDFForAllDeferred = $.Deferred();
        fetchRDPDFForAll(taskCode, fromDate, toDate, fetchRDPDFForAllDeferred);
        return fetchRDPDFForAllDeferred;
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
  return new depositModel();
});
