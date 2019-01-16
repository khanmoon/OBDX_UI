define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var transactionList = function() {
    var baseService = BaseService.getInstance();
    return {
      getTransactionsList: function(fromDate, toDate) {
        var options = {
            url: "transactions/count?countFor={countFor}&fromDate={fromDate}&toDate={toDate}"
          },
          params = {
            "countFor": "approved",
            "fromDate": fromDate,
            "toDate": toDate
          };
          if(Constants.userSegment === "ADMIN"){
            options.url = "design-dashboard/data/corporateDashboard/my-approved-list";
            return baseService.fetchJSON(options);
          }
            return baseService.fetch(options, params);

      }
    };
  };
  return new transactionList();
});
