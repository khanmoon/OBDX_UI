define(["baseService", "jquery", "framework/js/constants/constants"], function(BaseService, $, Constants) {
  "use strict";
  var budgetDashboardCardModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var baseService = BaseService.getInstance();
    var getBudgetDetailsDeferred, getBudgetDetails = function(deferred) {
        var options = {
          url: "budget",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        if (Constants.userSegment === "ADMIN") {
          options.url = "design-dashboard/data/personal-finance-management/budgets-dashboard-card";
          baseService.fetchJSON(options);
        } else {
          baseService.fetch(options);
        }
      },
      persistHostTransactionsLocallyDeferred, persistHostTransactionsLocally = function(deferred) {
        var options = {
          url: "expenditures?spendTransactionType=DDA",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);

      };
    return {
      getBudgetDetails: function() {
        getBudgetDetailsDeferred = $.Deferred();
        getBudgetDetails(getBudgetDetailsDeferred);
        return getBudgetDetailsDeferred;
      },
      persistHostTransactionsLocally: function() {
        persistHostTransactionsLocallyDeferred = $.Deferred();
        persistHostTransactionsLocally(persistHostTransactionsLocallyDeferred);
        return persistHostTransactionsLocallyDeferred;
      }
    };
  };
  return new budgetDashboardCardModel();
});
