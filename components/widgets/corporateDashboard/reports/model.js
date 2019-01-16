  define([
    "jquery",
    "baseService",
    "framework/js/constants/constants"
  ], function($, BaseService, Constants) {
    "use strict";
    var Reports = function() {
      var baseService = BaseService.getInstance();
      return {
        listReportHistory: function(userType) {
          var options = {
              url: "reports/reportProcessHistory?pageSize=6&pageNo=1&reportType={userType}"
            },
            params = {
              "userType": userType
            };
            if(Constants.userSegment === "ADMIN"){
              options.url = "design-dashboard/data/corporateDashboard/reports";
              return baseService.fetchJSON(options);
            }
              return baseService.fetch(options,params);

        },
        downloadReport: function(reportReqId) {
          var options = {
              url: "reports/reportProcessHistory/{reportRequestId}"
            },
            params = {
              "reportRequestId": reportReqId
            };
            return baseService.fetch(options,params);
        }
      };
    };
    return new Reports();
  });
