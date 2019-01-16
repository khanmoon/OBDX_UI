define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var fileHistoryModel = function() {
    var
      baseService = BaseService.getInstance(),
      getFileDeferred, getFile = function(deferred, fileRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/responsefile"
          },
          params = {
            "fileRefId": fileRefId
          };
        baseService.downloadFile(options, params);
      },
      getErrorFileDeferred, getErrorFile = function(deferred, fileRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/responsefile?fileType=error"
          },
          params = {
            "fileRefId": fileRefId
          };
        baseService.downloadFile(options, params);
      },
      getResponseFileDeferrred, getResponseFile = function(deferred, fileRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/responsefile?fileType=response"
          },
          params = {
            "fileRefId": fileRefId
          };
        baseService.downloadFile(options, params);
      },
      getRecordCountWithStatusDeferred, getRecordCountWithStatus = function(deferred, fileRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/recordStatusCount",
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
      },
      getFileWorkFlowStagesDeferred, getFileWorkFlowStages = function(deferred) {
        var options = {
          url: "enumerations/fileWorkFlowStages",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getFile: function(fileRefId) {
        getFileDeferred = $.Deferred();
        getFile(getFileDeferred, fileRefId);
        return getFileDeferred;
      },
      getErrorFile: function(fileRefId) {
        getErrorFileDeferred = $.Deferred();
        getErrorFile(getErrorFileDeferred, fileRefId);
        return getErrorFileDeferred;
      },
      getResponseFile: function(fileRefId) {
        getResponseFileDeferrred = $.Deferred();
        getResponseFile(getResponseFileDeferrred, fileRefId);
        return getResponseFileDeferrred;
      },
      getRecordCountWithStatus: function(fileRefId) {
        getRecordCountWithStatusDeferred = $.Deferred();
        getRecordCountWithStatus(getRecordCountWithStatusDeferred, fileRefId);
        return getRecordCountWithStatusDeferred;
      },
      getFileWorkFlowStages: function() {
        getFileWorkFlowStagesDeferred = $.Deferred();
        getFileWorkFlowStages(getFileWorkFlowStagesDeferred);
        return getFileWorkFlowStagesDeferred;
      }
    };
  };
  return new fileHistoryModel();
});