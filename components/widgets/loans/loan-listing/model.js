define(["baseService","framework/js/constants/constants"], function(BaseService, Constants) {
  "use strict";
  var LoanListingModel = function() {
    var baseService = BaseService.getInstance();
    return {
      fetchLoans: function() {
        var options = {
          url: "accounts/loan?status=ACTIVE"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/loans/loan-analysis/accounts";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);
      }
    };
  };
  return new LoanListingModel();
});
