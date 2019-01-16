define([
  "jquery",
  "baseService","framework/js/constants/constants"
], function($, BaseService,Constants) {
  "use strict";

  var SpendSummary = function SpendSummary() {

    var baseService = BaseService.getInstance(),

      getSpendAnalysisDeferred, getSpendAnalysis = function(filter, deferred) {
        var options = {
          url: "expenditures?isSummary=true" + filter,

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        if(Constants.userSegment==="ADMIN"){
          options.url="design-dashboard/data/personal-finance-management/spend-summary";
          baseService.fetchJSON(options);
        }else{
          baseService.fetch(options);
        }

      },
      hostDateDeferred, getHostDate = function(deferred) {

        var options = {
          url: "payments/currentDate",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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

      getSpendAnalysis: function(filter) {
        getSpendAnalysisDeferred = $.Deferred();
        getSpendAnalysis(filter, getSpendAnalysisDeferred);
        return getSpendAnalysisDeferred;
      },
      persistHostTransactionsLocally: function() {
        persistHostTransactionsLocallyDeferred = $.Deferred();
        persistHostTransactionsLocally(persistHostTransactionsLocallyDeferred);
        return persistHostTransactionsLocallyDeferred;
      },
      getHostDate: function() {
        hostDateDeferred = $.Deferred();
        getHostDate(hostDateDeferred);
        return hostDateDeferred;
      }
    };
  };

  return new SpendSummary();
});