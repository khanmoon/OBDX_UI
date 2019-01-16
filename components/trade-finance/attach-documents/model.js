define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var AttachDocumentsModel = function() {
    var fetchCategoryDeferred, fetchCategory = function(deferred) {
        var options = {
          url: "documentcontent/documentcategories",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      uploadDocumentDeferred,
      uploadDocument = function(form, deferred) {
        var options = {
          url: "contents",
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
      getDocumentDeffered, fetchDocumentsByteArray = function(documentUrl, deferred) {
        var params = {
          documentUrl: documentUrl,
          mediaType: "media",
          transactionType: "LC"
        };
        var options = {
          url: "contents/{documentUrl}?transactionType={transactionType}&alt={mediaType}",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.downloadFile(options, params);
      };
    return {
      fetchCategory: function() {
        fetchCategoryDeferred = $.Deferred();
        fetchCategory(fetchCategoryDeferred);
        return fetchCategoryDeferred;
      },
      uploadDocument: function(form) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(form, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      },
      fetchDocumentsByteArray: function(documentUrl) {
        getDocumentDeffered = $.Deferred();
        fetchDocumentsByteArray(documentUrl, getDocumentDeffered);
        return getDocumentDeffered;
      }
    };
  };
  return new AttachDocumentsModel();
});