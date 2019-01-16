define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var fileApprovalModel = function() {
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
      listFilesDeferred, listFiles = function(deferred, fileRefId) {
        var options = {
            url: "fileUploads/files?fileId={fileRefId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "fileRefId": fileRefId
          };
        baseService.fetch(options, params);
      };
    return {
      getFileStatus: function() {
        getFileStatusDeferred = $.Deferred();
        getFileStatus(getFileStatusDeferred);
        return getFileStatusDeferred;
      },
      listFiles: function(fileRefId) {
        listFilesDeferred = $.Deferred();
        listFiles(listFilesDeferred, fileRefId);
        return listFilesDeferred;
      }
    };
  };
  return new fileApprovalModel();
});