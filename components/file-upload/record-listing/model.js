define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var recordListingModel = function() {
    var
      baseService = BaseService.getInstance(),

      getJSONDataDeferred, getJSONData = function(deferred) {
        var options = {
          url: "file-upload/record-component-mapping",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetchJSON(options);
      },
      downloadFileDetailsDeferred, downloadFileDetails = function(deferred, fileRefId, transactionType, searchParams, type) {
        var media, mediaFormat;
        if (type === "CSV") {
          media = "text/csv";
          mediaFormat = "csv";
        } else if (type === "PDF") {
          media = "application/pdf";
          mediaFormat = "pdf";

        }
        var options = {
            url: "fileUploads/files/{fileRefId}/records?transactionType={transactionType}" + searchParams + "&media={media}&mediaFormat={mediaFormat}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },

          params = {
            "fileRefId": fileRefId,
            "media": media,
            "mediaFormat": mediaFormat,
            "transactionType": transactionType

          };
        baseService.downloadFile(options, params);
      };

    return {
      getJSONData: function() {
        getJSONDataDeferred = $.Deferred();
        getJSONData(getJSONDataDeferred);
        return getJSONDataDeferred;
      },
      downloadFileDetails: function(fileRefId, transactionType, searchParams, type) {
        downloadFileDetailsDeferred = $.Deferred();
        downloadFileDetails(downloadFileDetailsDeferred, fileRefId, transactionType, searchParams, type);
        return downloadFileDetailsDeferred;
      }
    };
  };
  return new recordListingModel();
});