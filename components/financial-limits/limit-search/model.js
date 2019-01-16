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
  var CreateLimitModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
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
    var searchLimitDeffered,
      searchLimit = function(deferred, queryParams) {
        var params = {
            "limitType": queryParams.limitType,
            "limitName": queryParams.limitName,
            "limitDescription": queryParams.limitDescription,
            "fromDate":queryParams.fromDate,
            "toDate": queryParams.toDate
          },
          options = {
            url: "financialLimits?limitType={limitType}&limitName={limitName}&limitDescription={limitDescription}&fromDate={fromDate}&toDate={toDate}",

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
      searchLimit: function(queryParams) {
        searchLimitDeffered = $.Deferred();
        searchLimit(searchLimitDeffered, queryParams);
        return searchLimitDeffered;
      }
    };
  };
  return new CreateLimitModel();
});
