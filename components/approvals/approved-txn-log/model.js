define([
  "framework/js/constants/constants",
  "baseService"
], function (Constants, BaseService) {
  "use strict";
  var transactionList = function () {
    var baseService = BaseService.getInstance();
    return {
      getTransactionsList: function (fromDate, toDate) {
        return baseService.fetch({
          url: "transactions/count?countFor={countFor}&fromDate={fromDate}&toDate={toDate}&roleType={roleType}"
        }, {
          "countFor": "approved",
          "fromDate": fromDate,
          "toDate": toDate,
          "roleType": Constants.userSegment === "ADMIN" ? "A" : Constants.userSegment === "CORPADMIN" ? "PA" : "P"
        });
      }
    };
  };
  return new transactionList();
});