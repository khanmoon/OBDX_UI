define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var PayableBillsModel = function() {
    var baseService = BaseService.getInstance();
    return {
      fetchPayableBills: function() {
        var options = {
          url: "bills/summary"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/payable-receivable-bills";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      }
    };
  };
  return new PayableBillsModel();
});
