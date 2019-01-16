define(["baseService","framework/js/constants/constants"], function(BaseService, Constants) {
  "use strict";
  var LoansClosedModel = function() {
    var baseService = BaseService.getInstance();
    return {
      fetchClosedLoans: function() {
        var options = {
          url: "accounts/loan?status=CLOSED"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/loans/loan-analysis/accounts";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);
      }
    };
  };
  return new LoansClosedModel();
});
