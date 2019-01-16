define(["baseService", "jquery", "framework/js/constants/constants"], function (BaseService, $, Constants) {
  "use strict";
  var ListingModel = function () {
    var baseService = BaseService.getInstance();
    var fetchAccountsDeferred, fetchAccounts = function (deferred) {
      var options = {
        url: "accounts",
        success: function (data) {
          deferred.resolve(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/dashboard/net-worth-graph/accounts";
        baseService.fetchJSON(options);
      } else {
        baseService.fetch(options);
      }
    };
    return {
      fetchAccounts: function () {
        fetchAccountsDeferred = $.Deferred();
        fetchAccounts(fetchAccountsDeferred);
        return fetchAccountsDeferred;
      },
      creditCardDetails: function () {
        if (Constants.userSegment === "ADMIN") {
          return baseService.fetchJSON({
            url: "design-dashboard/data/dashboard/net-worth-graph/cards"
          });
        }
        return baseService.fetch({
            url: "accounts/cards/credit?expand=ALL"
        });
      }
    };
  };
  return new ListingModel();
});