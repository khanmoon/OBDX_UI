define(["jquery", "baseService", "framework/js/constants/constants"], function($, BaseService, Constants) {
    "use strict";
    var TDAccountsModel = function() {
      var baseService = BaseService.getInstance();

      var fetchAccountsDeferred, fetchAccounts = function(deferred) {
        var options = {
          url: "accounts/deposit",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        if (Constants.userSegment === "ADMIN") {
          options.url = "design-dashboard/data/term-deposits/td-accounts-overview";
          baseService.fetchJSON(options);
        } else {
          baseService.fetch(options);
        }
      };
      return {
        fetchAccounts: function() {
          fetchAccountsDeferred = $.Deferred();
          fetchAccounts(fetchAccountsDeferred);
          return fetchAccountsDeferred;
        }
      };
    };
    return new TDAccountsModel();
  });