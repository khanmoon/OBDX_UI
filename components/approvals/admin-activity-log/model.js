define([
  "jquery",
  "framework/js/constants/constants",
  "baseService"
], function ($, Constants, BaseService) {
  "use strict";
  var ActivityLogModel = function () {
    var baseService = BaseService.getInstance();
    var getTransactionListDeferred, getTransactionList = function (deferred, view, fromDate, toDate) {
      var url = "transactions?view={view}&discriminator={discriminator}&roleType={roleType}&fromDate={fromDate}&toDate={toDate}";
      var options = {
          url: url,
          success: function (data) {
            deferred.resolve(data);
          }
        },
        params = {
          "discriminator": "ADMIN_MAINTENANCE",
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
  return new ActivityLogModel();
});