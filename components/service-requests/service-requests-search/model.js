define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request Search Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsSearchModel
   */
  var ServiceRequestsSearchModel = function() {
    var baseService = BaseService.getInstance(),
      fetchDataDeferred,
      /**
       * Private method to fetch the service requests created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchData
       * @memberOf ErrorModel
       * @returns {void}
       * @private
       * @param {String} name - service request name for request to be searched
       * @param {String} description - service request description for request to be searched
       * @param {String} product - product for request to be searched
       * @param {String} requestType - request type for request to be searched
       * @param {Object} deferred - An object type deferred
       */
      fetchData = function(name, description, product, requestType, deferred) {
        var option = {
            url: "servicerequest/definitions?name={name}&description={description}&product={product}&requestType={requestType}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "name": name,
            "description": description,
            "product": product,
            "requestType": requestType
          };
        baseService.fetch(option, params);
      },
      readDataDeferred,
      /**
       * Private method to fetch the service requests details based on service request Id
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
            url: "servicerequest/definitions/{id}",
            success: function(data) {
              deferred.resolve(data);
            }
          },
          params = {
            "id": id
          };
        baseService.fetch(option, params);
      },
      fetchListDeferred,
      /**
       * Private method to fetch the service requests created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchList
       * @memberOf ErrorModel
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchList = function(deferred) {
        var options = {
          url: "servicerequest/definitions?count=3",
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
      fetchModuleTypesDeferred,
      /**
       * Private method to fetch the module types
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
      },
      updateStatusDeferred,
      /**
       * Private method to update status
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function updateStatus
       * @memberOf ErrorModel
       * @param {String} id - service request id for request
       * @param {String} remarks Remark for activation status change
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      updateStatus = function(id, remarks, deferred) {
        var
          options = {
            url: "servicerequest/definitions/"+id+"/status?="+remarks,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        baseService.update(options);
      };
    return {
      /**
       * Public method to fetch list of Service Requests. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchData
       * @memberOf ServiceRequestsSearchModel
       * @param {String} name Name of service request
       * @param {String} description description of service request
       * @param {String} product Product of service request
       * @param {String} requestType Request Type of service request
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestSearch.fetchData().done(function(data) {
       *
       *       });
       */
      fetchData: function(name, description, product, requestType) {
        fetchDataDeferred = $.Deferred();
        fetchData(name, description, product, requestType, fetchDataDeferred);
        return fetchDataDeferred;
      },
      /**
       * Public method to read Service Request details. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function readData
       * @memberOf ServiceRequestsSearchModel
       * @param {String} id Id of service request
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestSearch.readData().done(function(data) {
       *
       *       });
       */
      readData: function(id) {
        readDataDeferred = $.Deferred();
        readData(id, readDataDeferred);
        return readDataDeferred;
      },
      /**
       * Public method to fetch list of Service Requests. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchList
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestSearch.fetchList().done(function(data) {
       *
       *       });
       */
      fetchList: function() {
        fetchListDeferred = $.Deferred();
        fetchList(fetchListDeferred);
        return fetchListDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchSeverity
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestSearch.fetchTransactionTypes().done(function(data) {
       *
       *       });
       */
      fetchTransactionTypes: function() {
        fetchTransactionTypesDeferred = $.Deferred();
        fetchTransactionTypes(fetchTransactionTypesDeferred);
        return fetchTransactionTypesDeferred;
      },
      /**
       * Public method to fetch list of severity Types. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchSeverity
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestSearch.fetchSeverity().done(function(data) {
       *
       *       });
       */
      fetchSeverity: function() {
        fetchSeverityDeferred = $.Deferred();
        fetchSeverity(fetchSeverityDeferred);
        return fetchSeverityDeferred;
      },
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchStatuses
       * @memberOf ServiceRequestSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestSearch.fetchStatuses().done(function(data) {
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
       * @function fetchModuleTypes
       * @memberOf ServiceRequestsSearchModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestSearch.fetchModuleTypes().done(function(data) {
       *
       *       });
       */
      fetchModuleTypes: function() {
        fetchModuleTypesDeferred = $.Deferred();
        fetchModuleTypes(fetchModuleTypesDeferred);
        return fetchModuleTypesDeferred;
      },
      /**
       * Public method to update status. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function updateStatus
       * @memberOf ServiceRequestsSearchModel
       * @param {String} id Id of service request definition
       * @param {String} remarks Remark for service request activation status change
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestSearch.updateStatus().done(function(data) {
       *
       *       });
       */
      updateStatus: function(id, remarks) {
        updateStatusDeferred = $.Deferred();
        updateStatus(id,remarks,updateStatusDeferred);
        return updateStatusDeferred;
      }
    };
  };
  return new ServiceRequestsSearchModel();
});
