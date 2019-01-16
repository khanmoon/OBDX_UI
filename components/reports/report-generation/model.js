define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reportGenerationModel = function() {
    var Model = function() {
        this.reportCreationModel = {
          reportIdentifier: null,
          reportFreq: null,
          formatType: null,
          reportParams: "{}",
          reportSchFreq: null,
          startTime: null,
          reportType: null,
          endTime: null,
          accountId: null
        };
      },
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
      registerReportDeferred, registerReport = function(deferred, model) {
        var options = {
          url: "reports/reportRequest",
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      fetchParamsComponentDeferred, fetchParamsComponent = function(deferred) {
        var options = {
          url: "reports/paramsComponent",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetchJSON(options);
      },
      downloadReportDeferred, downloadReport = function(deferred, reportReqId) {
        var options = {
            url: "reports/reportProcessHistory/{reportReqId}"
          },
          params = {
            "reportReqId": reportReqId
          };
        baseService.downloadFile(options, params);
      },
      getReportFormatTypesDeferred, getReportFormatTypes = function(deferred) {
        var options = {
          url: "enumerations/reportFormatTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getReportFrequencyTypesDeferred, getReportFrequencyTypes = function(deferred) {
        var options = {
          url: "enumerations/reportFrequencyTypes",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      },
      getScheduledReportFrequencyTypesDeferred, getScheduledReportFrequencyTypes = function(deferred) {
        var options = {
          url: "enumerations/scheduledReportFrequencyTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            data = {
              "enumRepresentations": [{
                "data": [{
                  "code": "20",
                  "description": "ONCE",
                  "ordinal": 1
                }, {
                  "code": "30",
                  "description": "WEEKLY",
                  "ordinal": 2
                }, {
                  "code": "50",
                  "description": "MONTHLY",
                  "ordinal": 3
                }, {
                  "code": "90",
                  "description": "DAILY",
                  "ordinal": 4
                }]
              }]
            };
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };

    return {
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      getReportTypes: function(userType) {
        getReportTypesDeferred = $.Deferred();
        getReportTypes(getReportTypesDeferred, userType);
        return getReportTypesDeferred;
      },
      registerReport: function(model) {
        registerReportDeferred = $.Deferred();
        registerReport(registerReportDeferred, model);
        return registerReportDeferred;
      },
      getReportFormatTypes: function() {
        getReportFormatTypesDeferred = $.Deferred();
        getReportFormatTypes(getReportFormatTypesDeferred);
        return getReportFormatTypesDeferred;
      },
      getReportFrequencyTypes: function() {
        getReportFrequencyTypesDeferred = $.Deferred();
        getReportFrequencyTypes(getReportFrequencyTypesDeferred);
        return getReportFrequencyTypesDeferred;
      },
      getScheduledReportFrequencyTypes: function() {
        getScheduledReportFrequencyTypesDeferred = $.Deferred();
        getScheduledReportFrequencyTypes(getScheduledReportFrequencyTypesDeferred);
        return getScheduledReportFrequencyTypesDeferred;
      },
      downloadReport: function(reportReqId) {
        downloadReportDeferred = $.Deferred();
        downloadReport(downloadReportDeferred, reportReqId);
        return downloadReportDeferred;
      },
      fetchParamsComponent: function(reportReqId) {
        fetchParamsComponentDeferred = $.Deferred();
        fetchParamsComponent(fetchParamsComponentDeferred, reportReqId);
        return fetchParamsComponentDeferred;
      }
    };
  };
  return new reportGenerationModel();
});