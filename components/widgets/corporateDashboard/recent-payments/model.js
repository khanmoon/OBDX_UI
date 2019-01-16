define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var ActivityLogModel = function() {
    var baseService = BaseService.getInstance();
    return {
      getTransactionList: function(view, fromDate, toDate) {
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
          if(Constants.userSegment === "ADMIN"){
            options.url = "design-dashboard/data/corporateDashboard/recent-payments";
            return baseService.fetchJSON(options);
          }
            return baseService.fetch(options,params);

      }
    };
  };
  return new ActivityLogModel();
});
