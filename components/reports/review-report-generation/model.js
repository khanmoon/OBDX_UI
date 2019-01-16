define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var fuidViewModel = function() {
    var baseService = BaseService.getInstance(),
      getReportDataDeferred, getReportData = function(deferred, reportRequestId) {
        var options = {
          url: "reports/reportRequest/" + reportRequestId,
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
      fetchReportDetailsDeferred, fetchReportDetails = function(url, deferred) {
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          failure: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {

      getReportData: function(reportRequestId) {
        getReportDataDeferred = $.Deferred();
        getReportData(getReportDataDeferred, reportRequestId);
        return getReportDataDeferred;
      },
      getReportFrequencyTypes: function() {
        getReportFrequencyTypesDeferred = $.Deferred();
        getReportFrequencyTypes(getReportFrequencyTypesDeferred);
        return getReportFrequencyTypesDeferred;
      },
      fetchReportDetails: function(url) {
        fetchReportDetailsDeferred = $.Deferred();
        fetchReportDetails(url, fetchReportDetailsDeferred);
        return fetchReportDetailsDeferred;
      },
      fetchParamsComponent: function(reportReqId) {
        fetchParamsComponentDeferred = $.Deferred();
        fetchParamsComponent(fetchParamsComponentDeferred, reportReqId);
        return fetchParamsComponentDeferred;
      }
    };
  };
  return new fuidViewModel();
});