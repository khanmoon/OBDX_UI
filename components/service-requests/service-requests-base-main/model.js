define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request Base Main Model<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsBaseMainModel
   */
  var ServiceRequestsBaseMainModel = function () {
    var baseService = BaseService.getInstance(),
      fetchSRDefinitionDTODeferred,
      /**
       * Private method to fetch service requests
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchSRDefinitionDTO
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchSRDefinitionDTO = function (deferred) {
        var
          options = {
            url: "servicerequest/definitions",
            success: function (data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function (data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.fetch(options);
      },
      fetchSRCategoryDeferred,
      /**
       * Private method to fetch the Category types created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchSRCategory
       * @memberOf ErrorModel
       * @param {String} productName - Product name to fetch categories list
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchSRCategory = function (productName, deferred) {
        var
          options = {
            url: "servicerequest/products/{productName}/categories",
            success: function (data) {
              deferred.resolve(data);
            },
            error: function (data) {
              deferred.reject(data);
            }
          },
          params = {
            "productName": productName
          };
        baseService.fetch(options, params);
      };
    return {
      /**
       * Public method to fetch service requests
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchSRDefinitionDTO
       * @memberOf RestServiceModels
       * @returns {Object} fetchSRDefinitionDTODeferred
       * @example
       *      ServiceRequestsBaseMainModel.fetchSRDefinitionDTO().then(function (data) {
       *
       *      });
       */
      fetchSRDefinitionDTO: function () {
        fetchSRDefinitionDTODeferred = $.Deferred();
        fetchSRDefinitionDTO(fetchSRDefinitionDTODeferred);
        return fetchSRDefinitionDTODeferred;
      },
      /**
       * Public method to fetch list of Category Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchSRCategory
       * @memberOf ServiceRequestsBaseMainModel
       * @param {String} productName - product name on basis of which categories are fetched
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsBaseMainModel.fetchSRCategory().done(function(data) {
       *
       *       });
       */
      fetchSRCategory: function (productName) {
        fetchSRCategoryDeferred = $.Deferred();
        fetchSRCategory(productName, fetchSRCategoryDeferred);
        return fetchSRCategoryDeferred;
      }
    };
  };
  return new ServiceRequestsBaseMainModel();
});