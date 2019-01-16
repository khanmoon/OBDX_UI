define(["baseService","jquery","framework/js/constants/constants"], function(BaseService,$,Constants) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var forexCalculatorModel = function() {
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
    var fetchLoanCalculatorDeferred, fetchLoanCalculator = function(dataToBeSent, deferred) {
        var options = {
          url: "calculators/mortgage/schedule",
          data: dataToBeSent,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      fetchCurrencyDeferred, fetchCurrency = function(deferred) {
        var options = {
          url: "forex/currencyPairs",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        if(Constants.userSegment==="ADMIN"){
          options.url="design-dashboard/data/calculators/forex-calculator";
          baseService.fetchJSON(options);
        }else{
          baseService.fetch(options);
        }
      },
      fetchExAmountDeferred, fetchExAmount = function(payload, deferred) {
        var options = {
          url: "calculators/foreignExchange",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      };
    return {
      fetchLoanCalculator: function(dataToBeSent) {
        fetchLoanCalculatorDeferred = $.Deferred();
        fetchLoanCalculator(dataToBeSent, fetchLoanCalculatorDeferred);
        return fetchLoanCalculatorDeferred;
      },
      fetchExAmount: function(payload) {
        fetchExAmountDeferred = $.Deferred();
        fetchExAmount(payload, fetchExAmountDeferred);
        return fetchExAmountDeferred;
      },
      fetchCurrency: function() {
        fetchCurrencyDeferred = $.Deferred();
        fetchCurrency(fetchCurrencyDeferred);
        return fetchCurrencyDeferred;
      }
    };
  };
  return new forexCalculatorModel();
});
