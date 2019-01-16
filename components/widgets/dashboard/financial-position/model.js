define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var FinancialPositionModel = function() {

    var baseService = BaseService.getInstance(),
      fetchAccountsDetailsDeffered, fetchAccountsDetails = function(deffered) {
        var options = {
          url: "accounts",

          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchCreditCardsDetailsDeffered, fetchCreditCardsDetails = function(deffered) {
        var options = {
          url: "accounts/cards/credit?expand=ALL",

          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchAccountsDetails: function() {
        fetchAccountsDetailsDeffered = $.Deferred();
        fetchAccountsDetails(fetchAccountsDetailsDeffered);
        return fetchAccountsDetailsDeffered;
      },
      fetchCreditCardsDetails: function() {
        fetchCreditCardsDetailsDeffered = $.Deferred();
        fetchCreditCardsDetails(fetchCreditCardsDetailsDeffered);
        return fetchCreditCardsDetailsDeffered;
      }
    };
  };
  return new FinancialPositionModel();
});