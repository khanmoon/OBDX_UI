define(["baseService"], function(BaseService) {
  "use strict";
  var InactiveAccountsModel = function() {
    var baseService = BaseService.getInstance();
    return {
      fetchInactiveAccounts: function() {
        var options = {
          url: "accounts/demandDeposit?status=CLOSED"
        };
          return baseService.fetch(options);
      }
    };
  };
  return new InactiveAccountsModel();
});
