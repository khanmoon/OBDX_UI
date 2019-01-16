define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var PFMSummaryModel = function() {
    var baseService = BaseService.getInstance();
    var getGoalDetailsDeferred, getGoalDetails = function(deferred) {
      var options = {
        url: "goals?status=ACTIVE",
        selfLoader: true,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
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
        baseService.fetch(options);
      },
      getSpendAnalysisDeferred, getSpendAnalysis = function(deferred) {
        var options = {
          url: "expenditures?isSummary=true",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);

      };

    return {
      getGoalDetails: function() {
        getGoalDetailsDeferred = $.Deferred();
        getGoalDetails(getGoalDetailsDeferred);
        return getGoalDetailsDeferred;
      },
      getBudgetDetails: function() {
        getBudgetDetailsDeferred = $.Deferred();
        getBudgetDetails(getBudgetDetailsDeferred);
        return getBudgetDetailsDeferred;
      },
      getSpendAnalysis: function() {
        getSpendAnalysisDeferred = $.Deferred();
        getSpendAnalysis(getSpendAnalysisDeferred);
        return getSpendAnalysisDeferred;
      }
    };
  };
  return new PFMSummaryModel();
});