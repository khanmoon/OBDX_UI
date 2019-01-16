define([
  "jquery","framework/js/constants/constants",
  "baseService"
], function($,Constants, BaseService) {
  "use strict";
  var BulkFileAdminModel = function() {
    var baseService = BaseService.getInstance();
    var getTransactionListDeferred, getTransactionList = function(deferred, view) {
      var url = "transactions?view={view}&discriminator={discriminator}&roleType={roleType}";
      var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          }
        },
        params = {
          "discriminator": "BULK_FILE_ADMIN",
          "view": view,
          "roleType": Constants.userSegment === "ADMIN" ? "A" : Constants.userSegment === "CORPADMIN" ? "PA" : "P"

        };
      baseService.fetch(options, params);
    };
    return {
      getTransactionList: function(view) {
        getTransactionListDeferred = $.Deferred();
        getTransactionList(getTransactionListDeferred, view);
        return getTransactionListDeferred;
      }
    };
  };
  return new BulkFileAdminModel();
});
