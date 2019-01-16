define(["baseService","jquery"], function(BaseService,$) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var TDCalculatorModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.initialDepositAmount = {
          amount: null,
          currency: null
        };
         this.interestRate = null;
          this.tenure = {
          year: null,
          month: null,
          day: null
        };
      };
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
    var fetchLocalCurrencyDeferred, calculateAmountDeferred, calculateAmount = function(dataToBeSent, deferred) {
        var options = {
          url: "calculators/deposit/maturity",
          selfLoader: true,
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
      fetchLocalCurrency = function(deferred) {
        var options = {
          url: "bankConfiguration",
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
      calculateAmount: function(dataToBeSent) {
        calculateAmountDeferred = $.Deferred();
        calculateAmount(dataToBeSent, calculateAmountDeferred);
        return calculateAmountDeferred;
      },
      fetchLocalCurrency: function() {
        fetchLocalCurrencyDeferred = $.Deferred();
        fetchLocalCurrency(fetchLocalCurrencyDeferred);
        return fetchLocalCurrencyDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new TDCalculatorModel();
});
