define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for feedbackModel Model. This file contains the model definition
   * for list of properties fetched from the server from table digx_fw_config_all_b through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * <ul>
   *      <li>Service abstractions to fetch the list of properties:
   *          <ul>
   *              <li>[init()]{@link FeedbackModel.init}</li>
   *
   *              <li>[getProperty()]{@link FeedbackModel.getPieChartData}</li>
   *
   *          </ul>
   *      </li>
   * </ul>
   *
   * @namespace Categories~FeedbackModel
   * @class FeedbackModel
   */
  var FeedbackModel = function() {
    var baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      getPieChartDataDeferred,

      /**
       * Private method to fetch the Feedback analytics data for the pie chart. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getPieChartData
       * @memberOf FeedbackModel

       * @param {String} transactionId -transaction identifier for feedback analytics
       * @param {String} accessPoint - access point which is based on analytics like internet, mobile
       * @param {String} role - feedback roles for request to be searched
       * @param {String} fromDate - from date is when user selected date for analytics
       * @param {String} toDate - from date is when user selected date for analytics
      * @param {Object} deferred - An object type Deferred
       *
       * @returns {void}
       * @private
       */
      getPieChartData = function(transactionId, accessPoint, role, fromDate, toDate, deferred) {
        var options = {
            url: "feedback/reports?transactionId={transactionId}&accessPoint={accessPoint}&role={role}&fromDate={fromDate}&toDate={toDate}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "transactionId": transactionId,
            "accessPoint": accessPoint,
            "role": role,
            "fromDate": fromDate,
            "toDate": toDate
          };
        baseService.fetch(options, params);
      },
      getThreeTxnDataDeferred,

      /**
       * Private method to fetch the Feedback analytics data for the pie chart basis of top three and bottom three transactions. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getThreeTxnData
       * @memberOf FeedbackModel
       * @param {String} topCount - analysis data for top three transactions
       * @param {String} bottomCount - analysis data for bottom three transactions
       * @param {Object} deferred - An object type Deferred
       *
       * @returns {void}
       * @private
       */
      getThreeTxnData = function(topCount, bottomCount, deferred) {
        var options = {
            url: "feedback/reports?topCount=3&bottomCount=3",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "topCount": topCount,
            "bottomCount": bottomCount
          };
        baseService.fetch(options, params);
      },
      getLineChartDataDeferred,

      /**
       * Private method to fetch the Feedback analytics data for the line chart. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getLineChartData
       * @memberOf FeedbackModel
       * @param {String} transactionId -transaction identifier for feedback analytics
       * @param {String} accessPoint - access point which is based on analytics like internet, mobile
       * @param {String} role - feedback roles for request to be searched
       * @param {String} ratingOverPeriodData - time frame which is use for analytics based on time
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getLineChartData = function(transactionId, accessPoint, role, ratingOverPeriodData, deferred) {
        var options = {
            url: "feedback/reports?transactionId={transactionId}&accessPoint={accessPoint}&role={role}&ratingOverPeriodData=true",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "transactionId": transactionId,
            "accessPoint": accessPoint,
            "role": role,
            "ratingOverPeriodData": true
          };
        baseService.fetch(options, params);
      },
      getFeedbackTransactionDeferred,
      /**
       * Private method to fetch the Feedback Transaction. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getFeedbackTransaction
       * @memberOf FeedbackModel
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getFeedbackTransaction = function(deferred) {
        var options = {
          url: "resourceTasks?view=hierarchy",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getAccessPointDeferred,
      /**
       * Private method to fetch the Access point. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getAccessPoint
       * @memberOf FeedbackModel
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getAccessPoint = function(deferred) {
        var options = {
          url: "accessPoints?accessType=INT",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getTimeFrameDataDeferred,
      /**
       * Private method to fetch time frame for analytics. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getTimeFrameData
       * @memberOf FeedbackModel
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getTimeFrameData = function(deferred) {
        var options = {
          url: "enumerations/feedbackPeriod",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getFeedbackUserRoleDeferred,

      /**
       * Private method to fetch the user roles. This
       * method will resolve a passed deferred object, which can be returned
       * from calling function to the parent.
       *
       * @function getFeedbackUserRole
       * @memberOf FeedbackModel
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      getFeedbackUserRole = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getPieChartData: function(transactionId, accessPoint, role, fromDate, toDate) {
        getPieChartDataDeferred = $.Deferred();
        getPieChartData(transactionId, accessPoint, role, fromDate, toDate, getPieChartDataDeferred);
        return getPieChartDataDeferred;
      },
      getThreeTxnData: function(topCount, bottomCount) {
        getThreeTxnDataDeferred = $.Deferred();
        getThreeTxnData(topCount, bottomCount, getThreeTxnDataDeferred);
        return getThreeTxnDataDeferred;
      },
      getAccessPoint: function() {
        getAccessPointDeferred = $.Deferred();
        getAccessPoint(getAccessPointDeferred);
        return getAccessPointDeferred;
      },
      getLineChartData: function(transactionId, accessPoint, role, ratingOverPeriodData) {
        getLineChartDataDeferred = $.Deferred();
        getLineChartData(transactionId, accessPoint, role, ratingOverPeriodData, getLineChartDataDeferred);
        return getLineChartDataDeferred;
      },
      getFeedbackTransaction: function() {
        getFeedbackTransactionDeferred = $.Deferred();
        getFeedbackTransaction(getFeedbackTransactionDeferred);
        return getFeedbackTransactionDeferred;
      },
      getTimeFrameData: function() {
        getTimeFrameDataDeferred = $.Deferred();
        getTimeFrameData(getTimeFrameDataDeferred);
        return getTimeFrameDataDeferred;
      },
      getFeedbackUserRole: function() {
        getFeedbackUserRoleDeferred = $.Deferred();
        getFeedbackUserRole(getFeedbackUserRoleDeferred);
        return getFeedbackUserRoleDeferred;
      }
    };
  };
  return new FeedbackModel();
});
