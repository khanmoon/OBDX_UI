define(["baseService", "jquery", "framework/js/constants/constants"], function(BaseService, $, Constants) {
    "use strict";
    var ListingModel = function() {
        var baseService = BaseService.getInstance();
        var fetchAccountsDeferred, fetchAccounts = function(type, deferred) {
            var options = {
                url: "accounts/{type}",
                success: function(data) {
                    deferred.resolve(data);
                }
            };
            if (Constants.userSegment === "ADMIN") {
                options.url = "design-dashboard/data/demand-deposits/accounts-overview";
                baseService.fetchJSON(options);
            } else {
                baseService.fetch(options, { type: type });
            }
        };
        return {
            fetchAccounts: function(type) {
                fetchAccountsDeferred = $.Deferred();
                fetchAccounts(type, fetchAccountsDeferred);
                return fetchAccountsDeferred;
            }
        };
    };
    return new ListingModel();
});