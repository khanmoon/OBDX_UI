define(["jquery", "baseService"], function($, BaseService) {
  "use strict";
  /**
   * This file contains the Tech Agnostic Service
   * consisting of all the REST services APIs for the product component.
   *
   * @namespace CoApp~service
   * @class ProductService
   * @extends BaseService {@link BaseService}
   */
  var ProductGroupsModel = function() {
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
    var fetchProductsDeferred, fetchProducts = function(deferred) {
        var options = {
          url: "login/images",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetchJSON(options);
      },
      fetchProductGroupsDeferred, fetchProductGroups = function(url, deferred) {
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      createSessionDeferred,
      createSession = function(deferred) {
        var options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.add(options);
      };
    return {
      fetchProducts: function() {
        fetchProductsDeferred = $.Deferred();
        fetchProducts(fetchProductsDeferred);
        return fetchProductsDeferred;
      },
      fetchProductGroups: function(url) {
        fetchProductGroupsDeferred = $.Deferred();
        fetchProductGroups(url, fetchProductGroupsDeferred);
        return fetchProductGroupsDeferred;
      },
      createSession: function() {
        createSessionDeferred = $.Deferred();
        createSession(createSessionDeferred);
        return createSessionDeferred;
      }
    };
  };
  return new ProductGroupsModel();
});