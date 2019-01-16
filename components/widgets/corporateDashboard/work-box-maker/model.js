define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var ActivityLogModel = function() {
    var baseService = BaseService.getInstance();
    return {
      getCountList: function(view, fromDate, toDate) {
        var options = {
          url: "transactions/count?countFor={view}&fromDate={fromDate}&toDate={toDate}"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/work-box-maker/work-box-maker";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options, {
            fromDate: fromDate,
            toDate: toDate,
            view: view
          });

      },
      getTransactionList:function(view, fromDate, toDate){
        var url = "transactions?view={view}&discriminator={discriminator}";
        if (fromDate && toDate) {
          url += "&fromDate={fromDate}&toDate={toDate}";
        }
        var options = {
            url: url
          },
          params = {
            "discriminator": "PAYMENTS",
            "view": view,
            "fromDate": fromDate,
            "toDate": toDate

          };
        if(Constants.userSegment==="ADMIN"){
          options.url="design-dashboard/data/accounts/demand-deposit";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options, params);
      }
    };
  };
  return new ActivityLogModel();
});
