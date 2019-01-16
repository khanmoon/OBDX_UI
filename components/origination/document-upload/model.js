define(["jquery", "baseService"], function($, BaseService) {
  "use strict";
  /** This file serves as the service for the document-upload component. It's job is to place rest api calls to the server, and firing the success handler, passed as an argument. It acts as a layer between the component model and the server. To make a rest api call, an option object is created, containing the submissionId, the applicationId, etc and the successHandler, and the call is made.
   * @namespace {function} DocumentUpload.model
   * @class DocumentUploadModel
   */
  var DocumentUploadModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),
      fetchDocumentChecklistDeferred,
      /**
       * Private method to get the document checklist to be uploaded by user in application form.
       * This method will only be called if submissionId, applicantId is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchDocumentChecklist
       * @memberOf DocumentUploadModel
       * @param {String} submissionId - Submission id of the application
       * @param {String} applicantId Applicant id of the application
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */

      /**
       * fetchDocumentChecklist - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} productcode  description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      fetchDocumentChecklist = function(submissionId, applicantId, productcode, deferred) {
        var params = {
            ownerId: applicantId,
            productCode: productcode
          },
          options = {
            url : "documentcontent/documentcategories?productCode={productCode}",
            //  url: 'documents',
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      uploadDocumentDeferred,
      /**
       * This function will upload a document to the server.
       * This method will only be called if form data containing file details is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function uploadDocument
       * @memberOf DocumentUploadModel
       * @param {Object} form - this is the object that contains the file and its details, to be uploaded
       * @param {Object} deferred - deferred object
       * @returns {void}
       * @private
       */

      /**
       * uploadDocument - description
       *
       * @param  {type} form     description
       * @param  {type} deferred description
       * @return {type}          description
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
      deleteDocumentDeferred,
      /**
       * This function will delete the document uploaded to the server.
       * This method will only be called if form data containing file details is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function deleteDocument
       * @memberOf DocumentUploadModel
       * @param {Object} contentId - document id of the document to be deleted
       * @param {Object} deferred - deferred object
       * @returns {void}
       * @private
       */

      /**
       * deleteDocument - description
       *
       * @param  {type} contentId description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      deleteDocument = function(contentId, deferred) {
        var params = {
            contentId: contentId
          },
          options = {
            url: "contents/{contentId}?transactionType=OR",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function() {
              deferred.reject();
            }
          };
        baseService.remove(options, params);
      },
      fetchUploadedDocumentsDeferred,
      /**
       * Private method to get the detailed list of uploaded documents.
       * This method will only be called if submissionId is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function fetchUploadedDocuments
       * @memberOf DocumentUploadModel
       * @param {String} submissionId - Submission id of the application
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */

      /**
       * fetchUploadedDocuments - description
       *
       * @param  {type} submissionId description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      fetchUploadedDocuments = function(submissionId, deferred) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/documents",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      saveDocumentDeferred,
      /**
       * Private method to save the document details on server.
       * This method will only be called if submissionId is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function saveDocument
       * @memberOf DocumentUploadModel
       * @param {String} submissionId - Submission id of the application
       * @param {String} documentId - document id of the application
       * @param {Object} model payload to be sent in the request
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */

      /**
       * saveDocument - description
       *
       * @param  {type} submissionId description
       * @param  {type} documentId   description
       * @param  {type} model        description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      saveDocument = function(submissionId, documentId, model, deferred) {
        var params = {
            submissionId: submissionId,
            documentId: documentId
          },
          options = {
            url: "submissions/{submissionId}/documents/{documentId}",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.add(options, params);
      },
      deleteLocalDocumentDeferred,
      /**
       * Private method to delete the document details saved locally on server.
       * This method will only be called if submissionId is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function deleteLocalDocument
       * @memberOf DocumentUploadModel
       * @param {String} submissionId - Submission id of the application
       * @param {String} documentId - document id of the application
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */

      /**
       * deleteLocalDocument - description
       *
       * @param  {type} submissionId description
       * @param  {type} documentId   description
       * @param  {type} deferred     description
       * @return {type}              description
       */
      deleteLocalDocument = function(submissionId, documentId, deferred) {
        var params = {
            submissionId: submissionId,
            documentId: documentId
          },
          options = {
            url: "submissions/{submissionId}/documents/{documentId}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.remove(options, params);
      },
      downloadDocumentDeffered,
      /**
       * Private method to download the file from server.
       * This method will only be called if submissionId is present, and will resolve a
       * passed deferred object, which can be returned from calling function to the parent.
       *
       * @function downloadDocument
       * @memberOf DocumentUploadModel
       * @param {String} contentId - document reference id
       * @param {String} ownerId - applicant id of owner
       * @param {Object} deferred - An object type Deferred
       * @returns {void}
       * @private
       */

      /**
       * downloadDocument - description
       *
       * @param  {type} contentId description
       * @param  {type} ownerId   description
       * @param  {type} deferred  description
       * @return {type}           description
       */
      downloadDocument = function(contentId, ownerId, deferred) {
        var params = {
          contentId: contentId,
          mediaType: "media",
          ownerId: ownerId
        };
        var options = {
          url: "contents/{contentId}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.downloadFile(options, params);
      };
    return {
      /**
       * Public method to get the document checklist to be uploaded by user in application form.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchDocumentChecklist
       * @memberOf DocumentUploadModel
       * @param {String} submissionId Submission id of the application
       * @param {String} applicantId Applicant id of the application
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.fetchDocumentChecklist().then(function (data) {
       *
       * });
       */

      /**
       * fetchDocumentChecklist - description
       *
       * @param  {type} submissionId description
       * @param  {type} applicantId  description
       * @param  {type} productCode  description
       * @return {type}              description
       */
      fetchDocumentChecklist: function(submissionId, applicantId, productCode) {
        fetchDocumentChecklistDeferred = $.Deferred();
        fetchDocumentChecklist(submissionId, applicantId, productCode, fetchDocumentChecklistDeferred);
        return fetchDocumentChecklistDeferred;
      },
      /**
       * Public method to get the detailed list of uploaded documents.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function fetchUploadedDocuments
       * @memberOf DocumentUploadModel
       * @param {String} submissionId Submission id of the application
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.fetchUploadedDocuments().then(function (data) {
       *
       * });
       */

      /**
       * fetchUploadedDocuments - description
       *
       * @param  {type} submissionId description
       * @return {type}              description
       */
      fetchUploadedDocuments: function(submissionId) {
        fetchUploadedDocumentsDeferred = $.Deferred();
        fetchUploadedDocuments(submissionId, fetchUploadedDocumentsDeferred);
        return fetchUploadedDocumentsDeferred;
      },
      /**
       * Public method to upload the document.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function uploadDocument
       * @memberOf DocumentUploadModel
       * @param {Object} form form data containing the file details to be uploaded
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.uploadDocument().then(function (data) {
       *
       * });
       */

      /**
       * uploadDocument - description
       *
       * @param  {type} form description
       * @return {type}      description
       */
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      },
      /**
       * Public method to delete the document.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteDocument
       * @memberOf DocumentUploadModel
       * @param {Object} contentId document id of the file to be deleted
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.deleteDocument().then(function (data) {
       *
       * });
       */

      /**
       * deleteDocument - description
       *
       * @param  {type} contentId description
       * @return {type}           description
       */
      deleteDocument: function(contentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(contentId, deleteDocumentDeferred);
        return deleteDocumentDeferred;
      },
      /**
       * Public method to save the document details on server.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function saveDocument
       * @memberOf DocumentUploadModel
       * @param {String} submissionId Submission id of the application
       * @param {String} documentId document id of the application
       * @param {Object} model payload to be sent in the request
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.saveDocument(submissionId, documentId, model).then(function (data) {
       *
       * });
       */

      /**
       * saveDocument - description
       *
       * @param  {type} submissionId description
       * @param  {type} documentId   description
       * @param  {type} model        description
       * @return {type}              description
       */
      saveDocument: function(submissionId, documentId, model) {
        saveDocumentDeferred = $.Deferred();
        saveDocument(submissionId, documentId, model, saveDocumentDeferred);
        return saveDocumentDeferred;
      },
      /**
       * Public method to delete the document details saved on server locally.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function deleteLocalDocument
       * @memberOf DocumentUploadModel
       * @param {String} submissionId Submission id of the application
       * @param {String} documentId document id of the application
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.deleteLocalDocument(submissionId, documentId).then(function (data) {
       *
       * });
       */

      /**
       * deleteLocalDocument - description
       *
       * @param  {type} submissionId description
       * @param  {type} documentId   description
       * @return {type}              description
       */
      deleteLocalDocument: function(submissionId, documentId) {
        deleteLocalDocumentDeferred = $.Deferred();
        deleteLocalDocument(submissionId, documentId, deleteLocalDocumentDeferred);
        return deleteLocalDocumentDeferred;
      },
      /**
       * Public method to download the file from server.
       * This method will instantiate a new deferred object and will return the same to the callee function
       * which will be resolved after call completion with appropriate data and developer
       * can use .then(handler) to handle the data.
       *
       * @function downloadDocument
       * @memberOf DocumentUploadModel
       * @param {String} contentId document reference id
       * @param {String} ownerId applicant id of owner
       * @returns {Object} An object of type deferred
       * @example
       * DocumentUploadModel.downloadDocument().then(function (data) {
       *
       * });
       */

      /**
       * downloadDocument - description
       *
       * @param  {type} contentId description
       * @param  {type} ownerId   description
       * @return {type}           description
       */
      downloadDocument: function(contentId, ownerId) {
        downloadDocumentDeffered = $.Deferred();
        downloadDocument(contentId, ownerId, downloadDocumentDeffered);
        return downloadDocumentDeffered;
      }
    };
  };
  return new DocumentUploadModel();
});
