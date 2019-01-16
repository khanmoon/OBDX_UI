define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var ScheduleModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      params;
    /**
     * This function fires a GET request to fetch the product flow details
     * and delegates control to the successhandler along with response data
     * once the details are successfully fetched
     *
     * @function fetchProductFlow
     * @memberOf ProductService
     * @param {String} productCode      - String indicating the product code of the product whose flow details are to be fetched
     * @param {Function} successHandler - function to be called once the flow details are successfully fetched
     * @example ProductService.fetchProductFlow('productCode',handler);
     */
    var fetchPDF = function(accountId, fromDate, toDate) {
      params = {
        "accountId": accountId,
        "fromDate": fromDate,
        "toDate": toDate
      };
      var options = {
        url: "accounts/loan/{accountId}/schedule?media=application/pdf&fromDate={fromDate}&toDate={toDate}"
      };
      baseService.downloadFile(options, params);
    };
    var fetchAccountInfoDeferred, fetchAccountInfo = function(accountId, deferred) {
        params = {
          "accountId": accountId
        };
        var options = {
          url: "accounts/loan/{accountId}",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      fetchScheduleInfoDeferred, fetchScheduleInfo = function(accountId, deferred) {
        params = {
          "accountId": accountId
        };
        var options = {
          url: "accounts/loan/{accountId}/schedule",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      };
    return {
      fetchPDF: function(accountId, fromDate, toDate) {
        fetchPDF(accountId, fromDate, toDate);
        return true;
      },
      fetchAccountInfo: function(accountId) {
        fetchAccountInfoDeferred = $.Deferred();
        fetchAccountInfo(accountId, fetchAccountInfoDeferred);
        return fetchAccountInfoDeferred;
      },
      fetchScheduleInfo: function(accountId) {
        fetchScheduleInfoDeferred = $.Deferred();
        fetchScheduleInfo(accountId, fetchScheduleInfoDeferred);
        return fetchScheduleInfoDeferred;
      }
    };
  };
  return new ScheduleModel();
});