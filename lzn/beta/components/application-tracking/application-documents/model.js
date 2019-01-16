define(["jquery", "baseService"], function($, BaseService) {
  "use strict";
  /** Tech agnostic service for application documents. This file serves as the service for the application-documents component. It's job is to place rest api calls to the server, and firing the success handler, passed as an argument. It acts as a layer between the component model and the server. To make a rest api call, an option object is created, containing the submissionId, the applicationId, etc and the successHandler, and the call is made.
   * @namespace {function} ApplicationDocuments.service
   * @class ApplicationDocumentsService
   * @extends BaseService {@link BaseService}
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
    /**
     * This function will fetch and return the id and address documents list. It fires a rest api call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled.
     * @deprecated
     * @function fetchDocumentsList
     * @memberOf ApplicationDocumentsService
     * @param {function} successHandler - function fired after the data is recieved
     */
    var fetchDocumentsListDeferred,
      fetchDocumentsList = function(successHandler, deferred) {
        var options = {
          url: "enumerations/identificationType",
          success: function(data) {
            successHandler(data);
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * This function will fetch and return the documents checklist. It fires a rest api call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled.
       * @function fetchDocumentChecklist
       * @memberOf ApplicationDocumentsService
       * @param {function} successHandler - function fired after the data is recived
       */
      fetchDocumentChecklistDeferred,
      fetchDocumentChecklist = function(submissionId, applicationId, deferred) {
        var options = {
          url: "submissions/" + submissionId + "/applications/" + applicationId + "/documents",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       * This function will upload a document to the server. Along with the document, it also passes a checklist id, which identifies the document as linked to a submission and an application id. It fires an ajax call, and once the call is completed, the function 'successHandler is fired, which is passed as an argument. It takes submissionId and applicationId also as arguments. Before placing the call, an 'option' object is created, which has the url, formed using submission and application ids and the successs handler bundled.
       * @function uploadDocument
       * @memberOf ApplicationDocumentsService
       * @param {Object} form - this is the object that contains the file and its details, to be uploaded
       * @param {function} successHandler - function fired after the data is recieved
       * @param {function} errorHandler - function fired if there is an error contacting the server
       */
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
      getDocumentDeffered,
      fetchDocumentsByteArray = function(documentUrl, ownerId, deferred) {
        var params = {
          documentUrl: documentUrl.value,
          mediaType: "media",
          ownerId: ownerId
        };
        var options = {
          url: "contents/{documentUrl}?alt={mediaType}&ownerId={ownerId}&transactionType=OR",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.downloadFile(options, params);
      },
      getDocumentInfoDeffered,
      getDocumentInfo = function(documentId, ownerId, deferred) {
        var params = {
          documentId: documentId,
          ownerId: ownerId
        };
        var options = {
          url: "contents/{documentId}?ownerId={ownerId}&transactionType=OR",
          selfLoader: true,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options, params);
      },
      deleteDocumentDeferred,
      deleteDocument = function(documentId, deferred) {
        var params = {
          documentId: documentId
        };
        var options = {
          url: "contents/{documentId}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options, params);
      };
    return {

      fetchDocumentsList: function(successHandler) {
        fetchDocumentsListDeferred = $.Deferred();
        fetchDocumentsList(successHandler, fetchDocumentsListDeferred);
        return fetchDocumentsListDeferred;
      },
      fetchDocumentsByteArray: function(documentUrl, ownerId) {
        getDocumentDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, ownerId, getDocumentDeffered);
        return getDocumentDeffered;
      },
      getDocumentInfo: function(documentId, ownerId) {
        getDocumentInfoDeffered = $.Deferred();
        getDocumentInfo(documentId, ownerId, getDocumentInfoDeffered);
        return getDocumentInfoDeffered;
      },
      fetchDocumentChecklist: function(submissionId, applicationId) {
        fetchDocumentChecklistDeferred = $.Deferred();
        fetchDocumentChecklist(submissionId, applicationId, fetchDocumentChecklistDeferred);
        return fetchDocumentChecklistDeferred;
      },
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      },
      deleteDocument: function(documentId) {
        deleteDocumentDeferred = $.Deferred();
        deleteDocument(documentId, deleteDocumentDeferred);
        return deleteDocumentDeferred;
      }
    };

  };
  return new ApplicationDocumentsService();
});
