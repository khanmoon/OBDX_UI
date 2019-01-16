define([
  "jquery", "framework/js/constants/constants",
  "baseService"
], function ($, Constants, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var TradeFinanceModel = function () {
    var getTransactionListDeferred,
      getTransactionList = function (deferred, view, fromDate, toDate) {
        var url = "transactions?view={view}&discriminator={discriminator}&roleType={roleType}";
        if (fromDate && toDate) {
          url += "&fromDate={fromDate}&toDate={toDate}";
        }
        var options = {
            url: url,
            success: function (data) {
              deferred.resolve(data);
            }
          },
          params = {
            "discriminator": "TRADE_FINANCE",
            "view": view,
            "fromDate": fromDate,
            "toDate": toDate,
            "roleType": Constants.userSegment === "ADMIN" ? "A" : Constants.userSegment === "CORPADMIN" ? "PA" : "P"

          };
        baseService.fetch(options, params);
      };
    return {
      getTransactionList: function (view, fromDate, toDate) {
        getTransactionListDeferred = $.Deferred();
        getTransactionList(getTransactionListDeferred, view, fromDate, toDate);
        return getTransactionListDeferred;
      }
    };
  };
  return new TradeFinanceModel();
});