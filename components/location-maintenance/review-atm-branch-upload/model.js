define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var ReviewLocationUploadModel = function() {
    var params, baseService = BaseService.getInstance();

    var uploadDocumentDeferred, uploadDocument = function(file, type, deferred) {
        var form = new FormData();
        form.append("file", file);
        var options = {
          url: "locator/upload?type=" + type,
          formData: form,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.uploadFile(options);
      },
      fetchPDF = function(recordId) {
        params = {};
        var options = {
          url: "locator/download/" + recordId + "?media=text/csv&mediaFormat=csv"
        };
        baseService.downloadFile(options, params);
      };

    return {
      uploadDocument: function(file, type) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(file, type, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      },
      fetchPDF: function(recordId) {
        fetchPDF(recordId);
      }
    };
  };
  return new ReviewLocationUploadModel();
});