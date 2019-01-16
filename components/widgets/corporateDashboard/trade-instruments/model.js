define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var tradeInstrumentsModel = function() {
    var baseService = BaseService.getInstance();
    return {
      fetchTradeInstruments: function(expiryDate) {
        var options = {
          url: "tradefinance/summary?expiryDate={expiryDate}"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/trade-instruments";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options, {
            expiryDate: expiryDate
          });

      }
    };
  };
  return new tradeInstrumentsModel();
});
