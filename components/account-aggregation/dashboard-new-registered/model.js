define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var baseService = BaseService.getInstance();
    var LinkAccountDashboard = function () {
        var accountListDeferred, getAccountList = function(deferred) {
              var options = {
                url: "externalaccounts",
                success: function(data) {
                  deferred.resolve(data);
                },
                error: function(data) {
                  deferred.reject(data);
                }
              };
              baseService.fetch(options);
            };

        return {
          getAccountList: function() {
          accountListDeferred = $.Deferred();
          getAccountList(accountListDeferred);
          return accountListDeferred;
        }

        };
    };
    return new LinkAccountDashboard();
});
