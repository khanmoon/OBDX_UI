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
   * @class ServiceRequestFileUploadModel
   */
  var ServiceRequestFileUploadModel = function() {
    var baseService = BaseService.getInstance(),
    uploadDocumentDeferred,
    /**
     * Private method to upload files in a service request
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function uploadDocument
     * @memberOf ErrorModel
     * @param {Object} form - Data to be inserted
     * @param {Object} deferred - An object type deferred
     * @returns {void}
     * @private
     */
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
      };
    return {
      /**
       * Public method to add the new service request
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function uploadDocument
       * @memberOf RestServiceModels
       * @param {Object} form - payload to pass
       * @returns {Object} addServiceRequestDeferred
       * @example
       *      ServiceRequestFileUploadModel.uploadDocument().then(function (data) {
       *
       *      });
       */
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      }
    };
  };
  return new ServiceRequestFileUploadModel();
});
