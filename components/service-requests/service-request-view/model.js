define([
      "jquery",
      "baseService"
    ], function($, BaseService) {
      "use strict";
      /**
       * Main file for Service Request View Model. This file contains the model definition
       * for creating a new service request through REST call.<br/><br/>
       * The injected Model Class will have below properties:
       * @namespace
       * @class ServiceRequestsViewModel
       */
      var ServiceRequestsViewModel = function() {
        var baseService = BaseService.getInstance(),
          addServiceRequestDeferred,
          /**
           * Private method to create a service request
           * This method will resolve a passed deferred object which can be returned from calling function to the parent.
           * @function addServiceRequest
           * @memberOf ErrorModel
           * @param {Object} data - Data to be inserted
           * @param {Object} deferred - An object type deferred
           * @returns {void}
           * @private
           */
          addServiceRequest = function(data, deferred) {
            var
              options = {
                url: "servicerequest/definitions",
                data: data,
                success: function(data, status, jqXhr) {
                  deferred.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                  deferred.reject(data, status, jqXhr);
                }
              };
            baseService.add(options);
          },
          updateServiceRequestDeferred,
          /**
           * Private method to update a service request
           * This method will resolve a passed deferred object which can be returned from calling function to the parent.
           * @function updateServiceRequest
           * @memberOf ErrorModel
           * @param {String} id - service request id for request to be updated
           * @param {Object} data - Updated data,
           * @param {Object} deferred - An object type deferred
           * @returns {void}
           * @private
           */
          updateServiceRequest = function(id, data, deferred) {
            var
              options = {
                url: "servicerequest/definitions/{id}",
                data: data,
                success: function(data, status, jqXhr) {
                  deferred.resolve(data, status, jqXhr);
                },
                error: function(data, status, jqXhr) {
                  deferred.reject(data, status, jqXhr);
                }
              },
              params = {
                "id": id
              };
            baseService.update(options, params);
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
          fetchRequestTypesDeferred,
          /**
           * Private method to fetch the request types created by currentSelectionAdmin
           * This method will resolve a passed deferred object which can be returned from calling function to the parent.
           * @function fetchRequestTypes
           * @memberOf ErrorModel
           * @param {Object} deferred - An object type deferred
           * @returns {void}
           * @private
           */
          fetchRequestTypes = function(deferred) {
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
          };
            return {
              /**
               * Public method to add the new service request
               * This method will instantiate a new deferred object and will return the same to the callee function
               * which will be resolved after call completion with appropriate data and developer
               * can use .then(handler) to handle the data.
               *
               * @function addServiceRequest
               * @memberOf ServiceRequestsViewModel
               * @param {Object} data - payload to pass
               * @returns {Object} addServiceRequestDeferred
               * @example
               *      ServiceRequestView.addServiceRequest().then(function (data) {
               *
               *      });
               */
              addServiceRequest: function(data) {
                addServiceRequestDeferred = $.Deferred();
                addServiceRequest(data, addServiceRequestDeferred);
                return addServiceRequestDeferred;
              },
              /**
               * Public method to update a service request
               * This method will instantiate a new deferred object and will return the same to the callee function
               * which will be resolved after call completion with appropriate data and developer
               * can use .then(handler) to handle the data.
               *
               * @function updateServiceRequest
               * @memberOf ServiceRequestsViewModel
               * @param {String} id - service request id for request to be updated
               * @param {Object} data - payload to pass
               * @returns {Object} updateServiceRequestDeferred
               * @example
               *      ServiceRequestView.updateServiceRequest().then(function (data) {
               *
               *      });
               */
              updateServiceRequest: function(id, data) {
                updateServiceRequestDeferred = $.Deferred();
                updateServiceRequest(id, data, updateServiceRequestDeferred);
                return updateServiceRequestDeferred;
              },
              /**
               * Public method to fetch list of applicable statuses. This method will
               * instantiate a new deferred object and will return the same to the callee function
               * which will be resolved after call completion with appropriate data and developer
               * can use .then(handler) to handle the data.
               * This method will resolve a passed deferred object which can be returned from calling function to the parent.
               * @function fetchStatuses
               * @memberOf ServiceRequestsViewModel
               * @returns {Object} - deferredObject
               * @example
               *       ServiceRequestView.fetchStatuses().done(function(data) {
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
               * @memberOf ServiceRequestsViewModel
               * @returns {Object} - deferredObject
               * @example
               *       ServiceRequestView.fetchSeverity().done(function(data) {
               *
               *       });
               */
              fetchSeverity: function() {
                fetchSeverityDeferred = $.Deferred();
                fetchSeverity(fetchSeverityDeferred);
                return fetchSeverityDeferred;
              },
              /**
               * Public method to fetch list of request types. This method will
               * instantiate a new deferred object and will return the same to the callee function
               * which will be resolved after call completion with appropriate data and developer
               * can use .then(handler) to handle the data.
               * This method will resolve a passed deferred object which can be returned from calling function to the parent.
               * @function fetchRequestTypes
               * @memberOf ServiceRequestsViewModel
               * @returns {Object} - deferredObject
               * @example
               *       ServiceRequestView.fetchRequestTypes().done(function(data) {
               *
               *       });
               */
              fetchRequestTypes: function() {
                fetchRequestTypesDeferred = $.Deferred();
                fetchRequestTypes(fetchRequestTypesDeferred);
                return fetchRequestTypesDeferred;
              }
            };
          };
        return new ServiceRequestsViewModel();
      });
