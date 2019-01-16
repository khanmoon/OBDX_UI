define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AdditionalKycModel = function() {
    var baseService = BaseService.getInstance();
    var fetchOccupationListDeferred, fetchOccupationList = function(deferred) {
      var options = {
        url: "enumerations/occupationType",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    },
    fetchGrossAnnualIncomeListDeferred, fetchGrossAnnualIncomeList = function(deferred) {
      var options = {
        url: "enumerations/occupationType",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      fetchOccupationList: function() {
        fetchOccupationListDeferred = $.Deferred();
        fetchOccupationList(fetchOccupationListDeferred);
        return fetchOccupationListDeferred;
      },
      fetchGrossAnnualIncomeList: function() {
        fetchGrossAnnualIncomeListDeferred = $.Deferred();
        fetchGrossAnnualIncomeList(fetchGrossAnnualIncomeListDeferred);
        return fetchGrossAnnualIncomeListDeferred;
      }
    };
  };
  return new AdditionalKycModel();
});
