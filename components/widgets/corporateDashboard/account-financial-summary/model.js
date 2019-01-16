define([
  "jquery",
  "baseService",
  "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  var FinancialSummaryModel = function() {
    var params, baseService = BaseService.getInstance();
    return {
      getAccountDetails: function() {
        var options = {
          url: "accounts",
          selfLoader: true
        };
        if(Constants.userSegment === "ADMIN"){
          options.url = "design-dashboard/data/accounts/demand-deposit";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      },
      downloadAccounts: function(accountType) {
        params = {
          "accountType": accountType
        };
        var options = {
          url: "accounts/{accountType}?media=application/pdf"
        };
        return baseService.downloadFile(options, params);
      }
    };
  };
  return new FinancialSummaryModel();
});
