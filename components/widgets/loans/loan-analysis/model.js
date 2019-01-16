define(["jquery", "baseService", "framework/js/constants/constants"], function($, BaseService, Constants) {
  "use strict";
  var LoanAnalysisModel = function() {
    var baseService = BaseService.getInstance();
    var fetchBankConfigDeferred, fetchBankConfig = function(deferred) {
        var options = {
          url: "bankConfiguration",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        if (Constants.userSegment === "ADMIN") {
          options.url = "design-dashboard/data/loans/loan-analysis/bank-config";
          baseService.fetchJSON(options);
        } else {
          baseService.fetch(options);
        }
      },
      fetchAccountDataDeferred, fetchAccountData = function(deferred) {
        var options = {
          url: "accounts/loan?status=ACTIVE",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        if (Constants.userSegment === "ADMIN") {
          options.url = "design-dashboard/data/loans/loan-analysis/accounts";
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
      fetchAccountData: function() {
        fetchAccountDataDeferred = $.Deferred();
        fetchAccountData(fetchAccountDataDeferred);
        return fetchAccountDataDeferred;
      }
    };
  };
  return new LoanAnalysisModel();
});