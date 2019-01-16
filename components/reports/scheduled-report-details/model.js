define(["jquery","baseService"], function($,BaseService) {
  "use strict";
  var ScheduledReportDetailsModel = function() {
    var baseService = BaseService.getInstance();
     var deleteReportDeferred, deleteReport= function(deferred, reportRequestIdentifierId, userType) {
        var options;
        if (userType === "CORP") {
          options = {
            url: "reports/reportRequest/reportType/U/reportId/{reportRequestIdentifierId}",
            success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
          };
           baseService.remove(options, {
            "reportRequestIdentifierId": reportRequestIdentifierId
          });
        } else {
          options = {
            url: "reports/reportRequest/reportType/A/reportId/{reportRequestIdentifierId}",
            success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
          };
           baseService.remove(options, {
            "reportRequestIdentifierId": reportRequestIdentifierId
          });
        }
      };
    return {
      getSelectedReportIdDetails: function(reportRequestIdentifierId) {
        var options = {
          url: "reports/reportRequest/{reportRequestIdentifierId}"
        };
        return baseService.fetch(options, {
          "reportRequestIdentifierId": reportRequestIdentifierId
        });
      },
       deleteReport: function(reportRequestIdentifierId, userType) {
        deleteReportDeferred = $.Deferred();
        deleteReport(deleteReportDeferred, reportRequestIdentifierId, userType);
        return deleteReportDeferred;
      }


    };
  };
  return new ScheduledReportDetailsModel();
});