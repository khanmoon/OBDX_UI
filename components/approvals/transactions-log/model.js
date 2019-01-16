define([
  "framework/js/constants/constants",
  "baseService"
], function (Constants, BaseService) {
  "use strict";
  var transactionList = function () {
    var baseService = BaseService.getInstance();
    return {
      getTransactionsList: function (view, fromDate, toDate) {
        var options = {
            url: "transactions/count?countFor={countFor}&fromDate={fromDate}&toDate={toDate}&roleType={roleType}"
          },
          params = {
            "countFor": view,
            "fromDate": fromDate,
            "toDate": toDate,
            "roleType": Constants.userSegment === "ADMIN" ? "A" : Constants.userSegment === "CORPADMIN" ? "PA" : "P"
          };
        return baseService.fetch(options, params);
      }
    };
  };
  return new transactionList();
});
