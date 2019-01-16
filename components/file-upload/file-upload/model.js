define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var fileUploadViewModel = function() {
    var baseService = BaseService.getInstance(),
      listBTIdDeferred, listBTId = function(deferred) {
        var options = {
          url: "fileUploads/userFileIdentifiersMappings",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getTransactionTypesDeferred, getTransactionTypes = function(deferred) {
        var options = {
          url: "enumerations/transactionTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getApprovalTypesDeferred, getApprovalTypes = function(deferred) {
        var options = {
          url: "enumerations/approvalTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getAccountingTypesDeferred, getAccountingTypes = function(deferred) {
        var options = {
          url: "enumerations/accountingTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getFileFormatTypesDeferred, getFileFormatTypes = function(deferred) {
        var options = {
          url: "enumerations/formatTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      uploadDocumentDeferred, uploadDocument = function(btId, file, deferred) {
        var form = new FormData();
        form.append("file", file);
        form.append("FI", btId);
        var options = {
          url: "fileUploads/files",
          formData: form,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.uploadFile(options);
      };
    return {
      listBTId: function() {
        listBTIdDeferred = $.Deferred();
        listBTId(listBTIdDeferred);
        return listBTIdDeferred;
      },
      getApprovalTypes: function() {
        getApprovalTypesDeferred = $.Deferred();
        getApprovalTypes(getApprovalTypesDeferred);
        return getApprovalTypesDeferred;
      },
      getFileFormatTypes: function() {
        getFileFormatTypesDeferred = $.Deferred();
        getFileFormatTypes(getFileFormatTypesDeferred);
        return getFileFormatTypesDeferred;
      },
      getAccountingTypes: function() {
        getAccountingTypesDeferred = $.Deferred();
        getAccountingTypes(getAccountingTypesDeferred);
        return getAccountingTypesDeferred;
      },
      getTransactionTypes: function() {
        getTransactionTypesDeferred = $.Deferred();
        getTransactionTypes(getTransactionTypesDeferred);
        return getTransactionTypesDeferred;
      },
      uploadDocument: function(btId, file) {
        uploadDocumentDeferred = $.Deferred();
        uploadDocument(btId, file, uploadDocumentDeferred);
        return uploadDocumentDeferred;
      }
    };
  };
  return new fileUploadViewModel();
});