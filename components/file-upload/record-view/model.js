define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var recordViewModel = function() {
    var
      baseService = BaseService.getInstance(),
      readRecordDeferred, readRecord = function(deferred, fileRefId, recRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/records/{recRefId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "fileRefId": fileRefId,
            "recRefId": recRefId
          };
        baseService.fetch(options, params);
      },
      getJSONDataDeferred, getJSONData = function(deferred) {
        var options = {
          url: "file-upload/record-component-mapping",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      },
      getRecordStatusDeferred, getRecordStatus = function(deferred) {
        var options = {
          url: "enumerations/recordStatuses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      deleteRecordsDeferred,
      deleteRecords = function(deferred, fileRefId, recordRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/records/{recordRefId}",
            success: function(result, status, xhr) {
              deferred.resolve(result, status, xhr);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "fileRefId": fileRefId,
            "recordRefId": recordRefId

          };
        baseService.remove(options, params);
      };
    return {
      readRecord: function(fileRefId, recRefId) {
        readRecordDeferred = $.Deferred();
        readRecord(readRecordDeferred, fileRefId, recRefId);
        return readRecordDeferred;
      },
      getRecordStatus: function() {
        getRecordStatusDeferred = $.Deferred();
        getRecordStatus(getRecordStatusDeferred);
        return getRecordStatusDeferred;
      },
      getJSONData: function() {
        getJSONDataDeferred = $.Deferred();
        getJSONData(getJSONDataDeferred);
        return getJSONDataDeferred;
      },
      deleteRecords: function(fileRefId, recordRefId) {
        deleteRecordsDeferred = $.Deferred();
        deleteRecords(deleteRecordsDeferred, fileRefId, recordRefId);
        return deleteRecordsDeferred;
      }
    };
  };
  return new recordViewModel();
});