define(["jquery", "baseService", "framework/js/constants/constants"], function($, BaseService, Constants) {
  "use strict";
  var DemandDepositAnalysisModel = function() {
    var baseService = BaseService.getInstance();

    var fetchBankConfigDeferred, fetchBankConfig = function(deferred) {
      var options = {
        url: "bankConfiguration",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/demand-deposits/demand-deposit-analysis/bank-config";
        baseService.fetchJSON(options);
      } else {
        baseService.fetch(options);
      }
    };
    var fetchDemandDepositAccountsDeferred, fetchDemandDepositAccounts = function(deferred) {
      var options = {
        url: "accounts/demandDeposit",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/demand-deposits/demand-deposit-analysis/accounts";
        baseService.fetchJSON(options);
      } else {
        baseService.fetch(options);
      }
    };
    return {
      fetchBankConfig: function() {
        fetchBankConfigDeferred = $.Deferred();
        fetchBankConfig(fetchBankConfigDeferred);
        return fetchBankConfigDeferred;
      },
      fetchDemandDepositAccounts: function() {
        fetchDemandDepositAccountsDeferred = $.Deferred();
        fetchDemandDepositAccounts(fetchDemandDepositAccountsDeferred);
        return fetchDemandDepositAccountsDeferred;
      }
    };
  };
  return new DemandDepositAnalysisModel();
});