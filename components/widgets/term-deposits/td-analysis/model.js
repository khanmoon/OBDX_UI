define(["baseService", "jquery", "framework/js/constants/constants"], function(BaseService, $, Constants) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var AnalysisModel = function() {
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
    var fetchAccountInfo = function(fetchAccountDeferred) {
      var options = {
        url: "accounts/deposit",
        success: function(data) {
          fetchAccountDeferred.resolve(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/term-deposits/td-analysis/accounts";
        baseService.fetchJSON(options);
      } else {
        baseService.fetch(options);
      }
    };
    var fetchBankConfig = function(deferred) {

      var options = {
        url: "bankConfiguration",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/term-deposits/td-analysis/bank-config";
        baseService.fetchJSON(options);
      } else {
        baseService.fetch(options,params);
      }
    };
    return {
      fetchBankConfig: function() {
        var fetchBankConfigDeferred = $.Deferred();
        fetchBankConfig(fetchBankConfigDeferred);
        return fetchBankConfigDeferred;
      },
      fetchAccountInfo: function() {
        var fetchAccountDeferred = $.Deferred();
        fetchAccountInfo(fetchAccountDeferred);
        return fetchAccountDeferred;
      }
    };
  };
  return new AnalysisModel();
});
