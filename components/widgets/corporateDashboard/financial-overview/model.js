define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var FinancialPositionModel = function() {
    var baseService = BaseService.getInstance();
    return {
      fetchCreditCardsDetails: function() {
        var options = {
          url: "accounts/cards/credit?expand=ALL"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/corporateDashboard/financial-position";
        return baseService.fetchJSON(options);
      }
          return baseService.fetch(options);

      },
      fetchAccountsDetails: function() {
        var options = {
          url: "accounts"
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/accounts/demand-deposit";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);
      }
    };
  };
  return new FinancialPositionModel();
});
