define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request Approval View Model. This file contains the model definition
   * for creating a new service request through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsApprovalViewModel
   */
  var ServiceRequestsApprovalViewModel = function() {
    var baseService = BaseService.getInstance(),
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
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchStatuses
       * @memberOf ServiceRequestsApprovalViewModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestApprovalView.fetchStatuses().done(function(data) {
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
       * @memberOf ServiceRequestsApprovalViewModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestApprovalView.fetchSeverity().done(function(data) {
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
       * @memberOf ServiceRequestsApprovalViewModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestApprovalView.fetchRequestTypes().done(function(data) {
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
  return new ServiceRequestsApprovalViewModel();
});
