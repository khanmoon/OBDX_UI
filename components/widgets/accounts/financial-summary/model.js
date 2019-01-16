define(["baseService", "jquery","framework/js/constants/constants"], function(BaseService, $,Constants) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var ListingModel = function() {
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
    var fetchCardInfoDeferred, fetchCardInfo = function(deferred) {
      var options = {
        url: "accounts/cards/credit?expand=ALL",
        showMessage: false,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      if(Constants.userSegment==="ADMIN"){
        options.url="design-dashboard/data/accounts/financial-summary/cards";
        baseService.fetchJSON(options);
      }else{
        baseService.fetch(options);
      }
    },fetchAccountsDeferred, fetchAccounts = function(deferred) {
      var options = {
        url: "accounts",
        showMessage: false,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      if(Constants.userSegment==="ADMIN"){
        options.url="design-dashboard/data/accounts/financial-summary/accounts";
        baseService.fetchJSON(options);
      }else{
        baseService.fetch(options);
      }
    };
    return {
      fetchCardInfo: function() {
        fetchCardInfoDeferred = $.Deferred();
        fetchCardInfo(fetchCardInfoDeferred);
        return fetchCardInfoDeferred;
      },
      fetchAccounts:function(){
        fetchAccountsDeferred = $.Deferred();
        fetchAccounts(fetchAccountsDeferred);
        return fetchAccountsDeferred;
      }
    };
  };
  return new ListingModel();
});