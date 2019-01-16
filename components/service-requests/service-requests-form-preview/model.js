define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Main file for Service Request Preview Model.<br/><br/>
   * The injected Model Class will have below properties:
   * @namespace
   * @class ServiceRequestsFormPreviewModel
   */
  var ServiceRequestsFormPreviewModel = function() {
    var baseService = BaseService.getInstance(),
    getFileDeferred,
    /**
     * Private method to fetch the service requests created by currentSelectionAdmin
     * This method will resolve a passed deferred object which can be returned from calling function to the parent.
     * @function getFile
     * @memberOf ErrorModel
     * @returns {void}
     * @private
     * @param {String} contentId - content ID of the uploaded image
     * @param {Object} deferred - An object type deferred
     */
    getFile = function(contentId, deferred) {
      var option = {
          url: "contents/{contentId}",
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          "contentId": contentId
        },
        headers = {
          "Content-Id": contentId,
          "Content-Type": "application/json"
        };
      baseService.fetch(option, params, headers);
    };
    return {
      /**
       * Public method to fetch list of Service Requests. This method will
       * instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       * This method will resolve a passed deferred object which can be returned from calling function to the parent.
       * @function getFile
       * @memberOf ServiceRequestsFormBuilderModel
       * @param {String} contentId Copntent ID of the uploaded image
       * @returns {Object} - deferredObject
       * @example
       *       ServiceRequestsFormPreviewModel.getFile().done(function(data) {
       *
       *       });
       */
      getFile: function(contentId) {
        getFileDeferred = $.Deferred();
        getFile(contentId, getFileDeferred);
        return getFileDeferred;
      }
    };
  };
  return new ServiceRequestsFormPreviewModel();
});
