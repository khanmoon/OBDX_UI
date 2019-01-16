define(["jquery", "baseService"], function($, BaseService) {
  "use strict";
  /**
   * Tech agnostic service for application documents. This file serves as the service for the application-documents component. It's job is to place rest api calls to the server, and firing the success handler, passed as an argument. It acts as a layer between the component model and the server. To make a rest api call, an option object is created, containing the submissionId, the applicationId, etc and the successHandler, and the call is made.
   * @namespace {function} ApplicationDocuments.service
   * @class ApplicationDocumentsService
   */
  var ApplicationDocumentsService = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance();
    var fetchDocumentChecklistDeferred,
      /**
       * Private method to get the document checklist to be uploaded by user in application form.
       * This method will only be called if submissionId, applicantId is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDocumentChecklist
       * @memberOf ApplicationDocumentsService
       * @param {String} submissionId - Submission id of the application
       * @param {String} applicationId Application id of the application
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchDocumentChecklist = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/documents",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      uploadDocumentDeferred,
      /**
       * This function will upload a document to the server.
       * This method will only be called if form data containing file details is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function uploadDocument
       * @memberOf ApplicationDocumentsService
       * @param {Object} form - this is the object that contains the file and its details, to be uploaded
       * @param {Object} deferred - deferred object
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
      },
      getDocumentDeffered,
      /**
       * Private method to download the file from server.
       * This method will only be called if submissionId is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDocumentsByteArray
       * @memberOf ApplicationDocumentsService
       * @param {String} documentUrl - document reference id
       * @param {String} ownerId - applicant id of owner
       * @param {String} applicationId - application id
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */
      fetchDocumentsByteArray = function(documentUrl, ownerId, applicationId, deferred) {
        var params = {
          documentUrl: documentUrl.value,
          mediaType: "media",
          ownerId: ownerId,
          applicationId: applicationId
        };
        var options = {
          url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&applicationId={applicationId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.downloadFile(options, params);
      };
    return {
      /**
       * Public method to download the file from server.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchDocumentsByteArray
       * @memberOf ApplicationDocumentsService
       * @param {String} documentUrl - document reference id
       * @param {String} ownerId - applicant id of owner
       * @param {String} applicationId - application id
       * @param {Object} deferred - An object type Deferred
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.fetchDocumentsByteArray().then(function (data) {
       *
       * });
       */
      fetchDocumentsByteArray: function(documentUrl, ownerId, applicationId) {
        getDocumentDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, ownerId, applicationId, getDocumentDeffered);
        return getDocumentDeffered;
      },
      /**
       * Public method to get the document checklist to be uploaded by user in application form.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchDocumentChecklist
       * @memberOf ApplicationDocumentsService
       * @param {String} submissionId Submission id of the application
       * @param {String} applicationId Application id of the application
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.fetchDocumentChecklist().then(function (data) {
       *
       * });
       */
      fetchDocumentChecklist: function(submissionId, applicationId) {
        fetchDocumentChecklistDeferred = $.Deferred();
        fetchDocumentChecklist(submissionId, applicationId, fetchDocumentChecklistDeferred);
        return fetchDocumentChecklistDeferred;
      },
      /**
       * Public method to upload the document.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function uploadDocument
       * @memberOf ApplicationDocumentsService
       * @param {Object} form form data containing the file details to be uploaded
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.uploadDocument().then(function (data) {
       *
       * });
       */
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      }
    };
  };
  return new ApplicationDocumentsService();
});