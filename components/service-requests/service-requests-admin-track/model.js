define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ServiceRequestsDetailModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * In case more than one instance of model is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     * @memberOf PreferenceFunctionsModel~PreferenceFunctionsModel
     */
    var
      approveRejectSRDeferred,
      /**
       * Private method to fetch the applicable statuses for the service request created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function approveRejectSR
       * @memberOf ErrorModel
       * @param {String} srID - An object type deferred
       * @param {String} remarks - An object type deferred
       * @param {String} status - An object type deferred
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      approveRejectSR = function(srID, remarks, status, deferred) {
        var params = {
            status: status,
            remarks: remarks
          },
          options = {
            url: "servicerequest/" + srID + "?status={status}&note={remarks}",
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            },
            error: function(data, status, jqXhr) {
              deferred.reject(data, status, jqXhr);
            }
          };
        baseService.patch(options, params);
      },
      fetchProductsDetailDeferred,
      /**
       * Private method to fetch the applicable statuses for the service request created by currentSelectionAdmin
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchProductsDetail
       * @memberOf ErrorModel
       * @param {String} srID - An object type deferred
       * @param {Object} deferred - An object type deferred
       * @returns {void}
       * @private
       */
      fetchProductsDetail = function(srID, deferred) {

        var options = {
          url: "servicerequest/" + srID,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
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
      };
    return {
      /**
       * Public method to fetch list of applicable statuses. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function approveRejectSR
       * @memberOf ServiceRequestTrackModel
       * @param {String} srID - An object type deferred
       * @param {String} remarks - An object type deferred
       * @param {String} status - An object type deferred
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsDetailModel.approveRejectSR(srID, remarks, status).done(function(data) {
       *
       *       });
       */
      approveRejectSR: function(srID, remarks, status) {
        approveRejectSRDeferred = $.Deferred();
        approveRejectSR(srID, remarks, status, approveRejectSRDeferred);
        return approveRejectSRDeferred;
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
       *       ServiceRequestsDetailModel.fetchSeverity().done(function(data) {
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
       * @function fetchProductsDetail
       * @memberOf ServiceRequestTrackModel
       * @param {String} srID - An object type deferred
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsDetailModel.fetchProductsDetail(srID).done(function(data) {
       *
       *       });
       */
      fetchProductsDetail: function(srID) {
        fetchProductsDetailDeferred = $.Deferred();
        fetchProductsDetail(srID, fetchProductsDetailDeferred);
        return fetchProductsDetailDeferred;
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
       *       ServiceRequestsDetailModel.fetchStatuses().done(function(data) {
       *
       *       });
       */
      fetchStatuses: function() {
        fetchStatusesDeferred = $.Deferred();
        fetchStatuses(fetchStatusesDeferred);
        return fetchStatusesDeferred;
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
       *       ServiceRequestsDetailModel.fetchRequestTypes().done(function(data) {
       *
       *       });
       */
      fetchRequestTypes: function() {
        fetchRequestTypesDeferred = $.Deferred();
        fetchRequestTypes(fetchRequestTypesDeferred);
        return fetchRequestTypesDeferred;
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
       *       ServiceRequestsDetailModel.fetchProductNames().done(function(data) {
       *
       *       });
       */
      fetchProductNames: function() {
        fetchProductNamesDeferred = $.Deferred();
        fetchProductNames(fetchProductNamesDeferred);
        return fetchProductNamesDeferred;
      }
    };
  };
  return new ServiceRequestsDetailModel();
});
