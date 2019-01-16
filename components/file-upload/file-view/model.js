define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var fileViewModel = function() {
    var baseService = BaseService.getInstance(),
      getFileStatusDeferred, getFileStatus = function(deferred) {
        var options = {
          url: "enumerations/fileStatuses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      listFileIdentifiersDeferred, listFileIdentifiers = function(deferred) {
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
      listFilesDeferred, listFiles = function(deferred, PARAMS) {
        var options = {
          url: PARAMS,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getPaymentTypesDeferred, getPaymentTypes = function(deferred) {
        var options = {
          url: "enumerations/transactionTypes",
          success: function(result, status, xhr) {
            deferred.resolve(result, status, xhr);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      deleteFileDeferred, deleteFile = function(deferred, fileRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}",
            success: function(result, status, xhr) {
              deferred.resolve(result, status, xhr);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "fileRefId": fileRefId

          };
        baseService.remove(options, params);
      };
    return {
      getFileStatus: function() {
        getFileStatusDeferred = $.Deferred();
        getFileStatus(getFileStatusDeferred);
        return getFileStatusDeferred;
      },
      listFiles: function(PARAMS) {
        listFilesDeferred = $.Deferred();
        listFiles(listFilesDeferred, PARAMS);
        return listFilesDeferred;
      },
      listFileIdentifiers: function() {
        listFileIdentifiersDeferred = $.Deferred();
        listFileIdentifiers(listFileIdentifiersDeferred);
        return listFileIdentifiersDeferred;
      },
      getPaymentTypes: function() {
        getPaymentTypesDeferred = $.Deferred();
        getPaymentTypes(getPaymentTypesDeferred);
        return getPaymentTypesDeferred;
      },
      deleteFile: function(fileRefId) {
        deleteFileDeferred = $.Deferred();
        deleteFile(deleteFileDeferred, fileRefId);
        return deleteFileDeferred;
      }
    };
  };
  return new fileViewModel();
});