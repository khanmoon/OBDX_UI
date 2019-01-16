define([
  "jquery", "framework/js/constants/constants",
  "baseService"
], function ($, Constants, BaseService) {
  "use strict";
  var BulkModel = function () {
    var baseService = BaseService.getInstance();
    var getActivityLogDetailsDeferred,
      getTransactionList = function (deferred, view, fromDate, toDate) {
        var url = "transactions?view={view}&discriminator={discriminator}&roleType={roleType}&fromDate={fromDate}&toDate={toDate}";
        var options = {
            url: url,
            success: function (data) {
              deferred.resolve(data);
            }
          },
          params = {
            "discriminator": "BULK_RECORD",
            "view": view,
            "fromDate": fromDate,
            "toDate": toDate,
            "roleType": Constants.userSegment === "ADMIN" ? "A" : Constants.userSegment === "CORPADMIN" ? "PA" : "P"

          };
        baseService.fetch(options, params);
      };

    return {
      getTransactionList: function (view, fromDate, toDate) {
        getActivityLogDetailsDeferred = $.Deferred();
        getTransactionList(getActivityLogDetailsDeferred, view, fromDate, toDate);
        return getActivityLogDetailsDeferred;
      }
    };
  };
  return new BulkModel();
});