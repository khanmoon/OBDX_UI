define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request Track Model. This file contains the model definition
   * for list of product names and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsTrackModel
   */
  var ServiceRequestsTrackModel = function() {
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
      fetchDataDeferred,
      /**
       * Private method to fetch the service requests created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchData
       * @memberOf ErrorModel
       * @returns {void}
       * @private
       * @param {String} productName - product name
       * @param {String} category - category name
       * @param {String} fromDate - form date
       * @param {String} toDate - to date
       * @param {String} status - status
       * @param {Object} deferred - deferred object
       */
      fetchData = function(productName, category, fromDate, toDate, status, deferred) {
        var option = {
            url: "servicerequest?product={productName}&categoryType={category}&fromDate={fromDate}&toDate={toDate}&status={status}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "productName": productName,
            "category": category,
            "fromDate": fromDate,
            "toDate": toDate,
            "status": status
          };
        baseService.fetch(option, params);
      },
      readDataDeferred,
      /**
       * Private method to fetch the service request details based on service request Id
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function readData
       * @memberOf ErrorModel
       * @returns {void}
       * @private
       * @param {String} id - service request id for request to be read
       * @param {Object} deferred - An object type deferred
       */
      readData = function(id, deferred) {
        var option = {
            url: "servicerequest/{id}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "id": id
          };
        baseService.fetch(option, params);
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
      fetchProductNamesDeferred,
      /**
       * Private method to fetch the product names (module types)
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchProductNames
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchProductNames = function(deferred) {
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
      },
      fetchRequestTypeDeferred,
      /**
       * Private method to fetch the request types
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchRequestType
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchRequestType = function(deferred) {
        var
          options = {
            url: "enumerations/srRequestType",

            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
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
       * @memberOf ServiceRequestsTrackModel
       * @param {String} productName - product name on basis of which categories are fetched
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestTrack.fetchCategoryTypes().done(function(data) {
       *
       *       });
       */
      fetchCategoryTypes: function(productName) {
        fetchCategoryTypesDeferred = $.Deferred();
        fetchCategoryTypes(productName, fetchCategoryTypesDeferred);
        return fetchCategoryTypesDeferred;
      },
      /**
       * Public method to fetch list of Service Requests. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchData
       * @memberOf ServiceRequestsTrackModel
       * @param {String} productName - product name
       * @param {String} category - category name
       * @param {String} fromDate - form date
       * @param {String} toDate - to date
       * @param {String} status - status
       * @param {Object} - deferred object
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestTrack.fetchData().done(function(data) {
       *
       *       });
       */
      fetchData: function(productName, category, fromDate, toDate, status) {
        fetchDataDeferred = $.Deferred();
        fetchData(productName, category, fromDate, toDate, status, fetchDataDeferred);
        return fetchDataDeferred;
      },
      /**
       * Public method to read Service Request details. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function readData
       * @memberOf ServiceRequestsTrackModel
       * @param {String} id - Id of service request
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestTrack.readData().done(function(data) {
       *
       *       });
       */
      readData: function(id) {
        readDataDeferred = $.Deferred();
        readData(id, readDataDeferred);
        return readDataDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchStatuses
       * @memberOf ServiceRequestTrackModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestTrack.fetchStatuses().done(function(data) {
       *
       *       });
       */
      fetchStatuses: function() {
        fetchStatusesDeferred = $.Deferred();
        fetchStatuses(fetchStatusesDeferred);
        return fetchStatusesDeferred;
      },
      /**
       * Public method to fetch list of Module Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchProductNames
       * @memberOf ServiceRequestsTrackModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestTrack.fetchProductNames().done(function(data) {
       *
       *       });
       */
      fetchProductNames: function() {
        fetchProductNamesDeferred = $.Deferred();
        fetchProductNames(fetchProductNamesDeferred);
        return fetchProductNamesDeferred;
      },
      /**
       * Public method to fetch list of request types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchRequestType
       * @memberOf ServiceRequestsTrackModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestTrack.fetchRequestType().done(function(data) {
       *
       *       });
       */
      fetchRequestType: function() {
        fetchRequestTypeDeferred = $.Deferred();
        fetchRequestType(fetchRequestTypeDeferred);
        return fetchRequestTypeDeferred;
      }
    };
  };
  return new ServiceRequestsTrackModel();
});
