define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request form builder Model. This file contains the model definition
   * for list of moduleType and data fetched from the server through REST call.<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsFormBuilderModel
   */
  var ServiceRequestsFormBuilderModel = function() {
    var baseService = BaseService.getInstance(),
    uploadDocumentDeferred,
      uploadDocument = function(form, deferred) {
        var options = {
          url: "contents",
          selfLoader: true,
          formData: form,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function() {
            deferred.reject();
          }
        };
        baseService.uploadFile(options);
      },
    fetchPanelDeferred,
    /**
     * Private method to fetch the service requests created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function fetchPanel
     * @memberOf ErrorModel
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
    fetchPanel = function(deferred) {
      var options = {
        url: "testing",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetchJSON(options);
    };
    return {
      /**
       * Public method to fetch list of Service Requests. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function fetchPanel
       * @memberOf ServiceRequestsFormBuilderModel
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestFormBuilder.fetchPanel().done(function(data) {
       *
       *       });
       */
      fetchPanel: function() {
        fetchPanelDeferred = $.Deferred();
        fetchPanel(fetchPanelDeferred);
        return fetchPanelDeferred;
      },
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      }
    };
  };
  return new ServiceRequestsFormBuilderModel();
});
