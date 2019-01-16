define(["baseService"], function(BaseService) {
  "use strict";
  var AccontSnapshotModel = function() {
    var baseService = BaseService.getInstance();
    return {
      getTransactions: function(accountId) {
        var options = {
          url: "accounts/demandDeposit/{accountId}/transactions?noOfTransactions=5&searchBy=LNT"
        };
        return baseService.fetch(options, {
          "accountId": accountId
        });
      }
    };
  };
  return new AccontSnapshotModel();
});
