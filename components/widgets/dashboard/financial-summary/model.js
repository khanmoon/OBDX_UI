define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var FinancialSummaryModel = function() {
    var baseService = BaseService.getInstance();
    var getAccountDetailsDeferred, getAccountDetails = function(deferred) {
      var options = {
        url: "accounts",
        selfLoader: true,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      getAccountDetails: function() {
        getAccountDetailsDeferred = $.Deferred();
        getAccountDetails(getAccountDetailsDeferred);
        return getAccountDetailsDeferred;
      }
    };
  };
  return new FinancialSummaryModel();
});