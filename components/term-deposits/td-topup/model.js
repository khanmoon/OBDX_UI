define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var topUpModel = function() {
    var params, baseService = BaseService.getInstance(),
      Model = function(currencyCode) {
        return {
          amount: {
            amount: "",
            currency: currencyCode
          },
          sourceAccountId: {
            value: null,
            displayValue: null
          },
          account: {
            displayValue: null,
            value: null
          },
          currentPrincipal: {
            currency: null,
            amount: null
          }
        };
      };
    var topUpDeferred, topUp = function(accountId, simulation, data, deferred) {
      var options = {
        url: "accounts/deposit/" + accountId + "/topUps?simulation=" + simulation,
        data: data,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.add(options);
    };
    var fetchAccountDetailsDeferred, fetchAccountDetails = function(accountId, deferred) {
      params = {
        accountId: accountId
      };
      var options = {
        url: "accounts/deposit/{accountId}",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.fetch(options, params);
    };
    return {
      topUp: function(accountId, simulation, data) {
        topUpDeferred = $.Deferred();
        topUp(accountId, simulation, data, topUpDeferred);
        return topUpDeferred;
      },
      fetchAccountDetails: function(accountId) {
        fetchAccountDetailsDeferred = $.Deferred();
        fetchAccountDetails(accountId, fetchAccountDetailsDeferred);
        return fetchAccountDetailsDeferred;
      },
      getNewModel: function(currency) {
        return new Model(currency);
      }
    };
  };
  return new topUpModel();
});
