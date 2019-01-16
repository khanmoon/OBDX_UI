define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request Create Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsCreateModel
   */
  var ServiceRequestCreateModel = function() {
    var baseService = BaseService.getInstance(),
      fetchCategoryTypesDeferred,
      /**
       * Private method to fetch the Category types created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchCategoryTypes
       * @memberOf ErrorModel
       * @param {String} productName - Product name to fetch categories list
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchCategoryTypes = function(productName, deferred) {
        var
          options = {
            url: "servicerequest/products/{productName}/categories",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "productName": productName
          };
        baseService.fetch(options, params);
      },
      fetchTransactionTypesDeferred,
      /**
       * Private method to fetch the task types created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchTransactionTypes
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchTransactionTypes = function(deferred) {
        var
          options = {
            url: "enumerations/srFormBuilderRequestTypes",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options);
      },
      fetchSeverityDeferred,
      /**
       * Private method to fetch the severity levels created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchSeverity
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchSeverity = function(deferred) {
        var
          options = {
            url: "enumerations/priorityType",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options);
      },
      fetchStatusesDeferred,
      /**
       * Private method to fetch the applicable statuses for the service request created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchStatuses
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchStatuses = function(deferred) {
        var
          options = {
            url: "enumerations/srStatus",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.fetch(options);
      },
      addSRProductDeferred,
      /**
       * Private method to add new product
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function addSRProduct
       * @memberOf ErrorModel
       * @param {object} data - data for submission
       * @param {object} deferred Deferred object
       * @returns {void}
       * @private
       *
       */
      addSRProduct = function(data, deferred) {
        var
          options = {
            url: "servicerequest/products",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.add(options);
      },
      addSRCategoryDeferred,
      /**
       * Private method to add new category type
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       *
       * @function addSRCategory
       * @memberOf ErrorModel
       * @param {String} productName - Product name to add a new category
       * @param {object} data - data for submission
       * @param {object} deferred Deferred object
       * @returns {void}
       * @private
       *
       */
      addSRCategory = function(productName, data, deferred) {
        var
          options = {
            url: "servicerequest/products/{productName}/categories",
            data: data,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "productName": productName
          };
        baseService.add(options, params);
      },
      fetchModuleTypesDeferred,
      /**
       * Private method to fetch the severity levels created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchModuleTypes
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchModuleTypes = function(deferred) {
        var
          options = {
            url: "servicerequest/products",
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
      /**
       * Public method to fetch list of Category Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchCategoryTypes
       * @memberOf ServiceRequestCreateModel
       * @param {String} productName - product name on basis of which categories are fetched
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestCreate.fetchCategoryTypes().done(function(data) {
       *
       *       });
       */
      fetchCategoryTypes: function(productName) {
        fetchCategoryTypesDeferred = $.Deferred();
        fetchCategoryTypes(productName, fetchCategoryTypesDeferred);
        return fetchCategoryTypesDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchStatuses
       * @memberOf ServiceRequestCreateModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestCreate.fetchStatuses().done(function(data) {
       *
       *       });
       */
      fetchStatuses: function() {
        fetchStatusesDeferred = $.Deferred();
        fetchStatuses(fetchStatusesDeferred);
        return fetchStatusesDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchSeverity
       * @memberOf ServiceRequestCreateModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestCreate.fetchSeverity().done(function(data) {
       *
       *       });
       */
      fetchSeverity: function() {
        fetchSeverityDeferred = $.Deferred();
        fetchSeverity(fetchSeverityDeferred);
        return fetchSeverityDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchTransactionTypes
       * @memberOf ServiceRequestCreateModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestCreate.fetchTransactionTypes().done(function(data) {
       *
       *       });
       */
      fetchTransactionTypes: function() {
        fetchTransactionTypesDeferred = $.Deferred();
        fetchTransactionTypes(fetchTransactionTypesDeferred);
        return fetchTransactionTypesDeferred;
      },
      /**
       * Public method to fetch list of module Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchModuleTypes
       * @memberOf ServiceRequestCreateModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestCreate.fetchModuleTypes().done(function(data) {
       *
       *       });
       */
      fetchModuleTypes: function() {
        fetchModuleTypesDeferred = $.Deferred();
        fetchModuleTypes(fetchModuleTypesDeferred);
        return fetchModuleTypesDeferred;
      },
      /**
       * Public method to add product. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function addSRProduct
       * @memberOf ServiceRequestCreateModel
       * @param {object} data data
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestCreate.addSRProduct().done(function(data) {
       *
       *       });
       */
      addSRProduct: function(data) {
        addSRProductDeferred = $.Deferred();
        addSRProduct(data, addSRProductDeferred);
        return addSRProductDeferred;
      },
      /**
       * Public method to add category. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function addSRCategory
       * @memberOf ServiceRequestCreateModel
       * @param {String} productName - Product name to store new category
       * @param {object} data data
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestCreate.addSRCategory().done(function(data) {
       *
       *       });
       */
      addSRCategory: function(productName, data) {
        addSRCategoryDeferred = $.Deferred();
        addSRCategory(productName, data, addSRCategoryDeferred);
        return addSRCategoryDeferred;
      }
    };
  };
  return new ServiceRequestCreateModel();
});
