define(["baseService","framework/js/constants/constants"], function(BaseService, Constants) {
  "use strict";
  var CreditLineUsageModel = function() {
    var baseService = BaseService.getInstance();
    return {
      fetchLines: function() {
        var options = {
          url: "parties/lineLimit"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/credit-line";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);
      }
    };
  };
  return new CreditLineUsageModel();
});
