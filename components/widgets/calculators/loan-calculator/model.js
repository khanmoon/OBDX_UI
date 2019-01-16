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
  var LoanCalculatorModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.principalAmount = {
          amount: null,
          currency: null
        };
         this.tenure = {
          year: null,
          month: null,
          day: null
        };
         this.interestRate = null;
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
    var fetchLocalCurrencyDeferred, calculateAmountDeferred, fetchCalculatorRangeDeferred, calculateLoanAmount = function (dataToBeSent, deferred) {
        var options = {
          url: "calculators/mortgage/schedule",
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
        if(Constants.userSegment==="ADMIN"){
          options.url="design-dashboard/data/calculators/loan-calculator";
          baseService.fetchJSON(options);
        }else{
          baseService.fetch(options);
        }
      },
      fetchCalculatorRange = function (index, module, attribute, deferred) {
        var params = {
            module: module,
            attribute: attribute
          },
          options = {
            url: "calculators/defaultRange?for={module}&var={attribute}",
            success: function (data) {
              deferred.resolve(data, index);
            },
            error: function (data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options, params);
      };
    return {
      calculateLoanAmount: function(dataToBeSent) {
        calculateAmountDeferred = $.Deferred();
        calculateLoanAmount(dataToBeSent, calculateAmountDeferred);
        return calculateAmountDeferred;
      },
      fetchLocalCurrency: function() {
        fetchLocalCurrencyDeferred = $.Deferred();
        fetchLocalCurrency(fetchLocalCurrencyDeferred);
        return fetchLocalCurrencyDeferred;
      },
      fetchCalculatorRange: function (index, module, attribute) {
        fetchCalculatorRangeDeferred = $.Deferred();
        fetchCalculatorRange(index, module, attribute, fetchCalculatorRangeDeferred);
        return fetchCalculatorRangeDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new LoanCalculatorModel();
});
