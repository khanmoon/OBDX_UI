define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var PFMdashboard = function PFMdashboard() {

    var baseService = BaseService.getInstance(),

      persistHostTransactionsLocallyDeferred, persistHostTransactionsLocally = function(deferred) {
        var options = {
          url: "expenditures?spendTransactionType=DDA",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);

      };

    return {
      persistHostTransactionsLocally: function() {
        persistHostTransactionsLocallyDeferred = $.Deferred();
        persistHostTransactionsLocally(persistHostTransactionsLocallyDeferred);
        return persistHostTransactionsLocallyDeferred;
      }
    };
  };

  return new PFMdashboard();
});