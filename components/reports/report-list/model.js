define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reportListModel = function() {
    var
      baseService = BaseService.getInstance(),

      getReportTypesDeferred, getReportTypes = function(deferred, userType) {
        var options;
        if (userType === "CORP") {
          options = {
            url: "reports/reportDefinition/userReports",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        } else {
          options = {
            url: "reports/reportDefinition/adminReports",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          };
        }

        baseService.fetch(options);

      },
      getReportFrequencyTypesDeferred, getReportFrequencyTypes = function(deferred) {
        var options = {
          url: "enumerations/reportFrequencyTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },

      downloadReportDeferred, downloadReport = function(deferred, reportRequestId) {
        var options = {
            url: "reports/reportProcessHistory/{reportRequestId}"
          },
          params = {
            "reportRequestId": reportRequestId
          };
        baseService.downloadFile(options, params);
      },
      listReportHistoryDeferred, listReportHistory = function(deferred, URL) {
        var options = {
          url: URL,
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
      getReportTypes: function(userType) {
        getReportTypesDeferred = $.Deferred();
        getReportTypes(getReportTypesDeferred, userType);
        return getReportTypesDeferred;
      },

      listReportHistory: function(url) {
        listReportHistoryDeferred = $.Deferred();
        listReportHistory(listReportHistoryDeferred, url);
        return listReportHistoryDeferred;
      },
      getReportFrequencyTypes: function() {
        getReportFrequencyTypesDeferred = $.Deferred();
        getReportFrequencyTypes(getReportFrequencyTypesDeferred);
        return getReportFrequencyTypesDeferred;
      },
      downloadReport: function(reportReqId) {
        downloadReportDeferred = $.Deferred();
        downloadReport(downloadReportDeferred, reportReqId);
        return downloadReportDeferred;
      }

    };
  };
  return new reportListModel();
});