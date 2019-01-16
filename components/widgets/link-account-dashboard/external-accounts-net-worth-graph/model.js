define(["baseService", "jquery", "framework/js/constants/constants"], function (BaseService, $, Constants) {
  "use strict";
  var ListingModel = function () {
    var baseService = BaseService.getInstance();
    var fetchAccountsDeferred, fetchAccounts = function (deferred) {
      var options = {
        url: "accounts",
        success: function (data) {
          deferred.resolve(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/dashboard/net-worth-graph/accounts";
        baseService.fetchJSON(options);
      } else {
        baseService.fetch(options);
      }
    },
    fetchAccesstokenDeferred, fetchAccesstoken = function(deferred) {
      var options = {
        url: "accesstokens",
        showMessage: false,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
        baseService.fetch(options);

    },
    fetchBankConfigurationDeferred, fetchBankConfiguration = function(deferred) {
      var options = {
        url: "bankConfiguration",
        showMessage: false,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
        baseService.fetch(options);

    },
    fetchExchangeRateDeferred, fetchExchangeRate = function(branchCode, baseCurrency, toCurrency, deferred) {
      var options = {
        url: "forex/rates?branchCode="+branchCode+"&ccy1Code="+baseCurrency+"&ccy2Code="+toCurrency,
        showMessage: false,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    },
    fetchexternalbankAccountsDeferred, fetchexternalbankAccounts = function(bankCode,deferred) {
      var options = {
                url: "externalBankAccounts?bankCode=" + bankCode ,

                success: function(data) {
                  deferred.resolve(data);
                },
                error: function(data) {
                  deferred.reject(data);
                }
              } ;
              baseService.fetch(options);
  };

    return {
      fetchAccounts: function () {
        fetchAccountsDeferred = $.Deferred();
        fetchAccounts(fetchAccountsDeferred);
        return fetchAccountsDeferred;
      },
      creditCardDetails: function () {
        if (Constants.userSegment === "ADMIN") {
          return baseService.fetchJSON({
            url: "design-dashboard/data/dashboard/net-worth-graph/cards"
          });
        }
        return baseService.fetch({
            url: "accounts/cards/credit?expand=ALL"
        });
      },
      fetchAccesstoken:function(){
        fetchAccesstokenDeferred = $.Deferred();
      fetchAccesstoken(fetchAccesstokenDeferred);
        return fetchAccesstokenDeferred;
      },
      fetchBankConfiguration:function(){
        fetchBankConfigurationDeferred = $.Deferred();
        fetchBankConfiguration(fetchBankConfigurationDeferred);
        return fetchBankConfigurationDeferred;
      },
      fetchExchangeRate:function(branchCode,baseCurrency,toCurrency){
        fetchExchangeRateDeferred = $.Deferred();
        fetchExchangeRate(branchCode,baseCurrency,toCurrency,fetchExchangeRateDeferred);
        return fetchExchangeRateDeferred;
      },
      fetchexternalbankAccounts:function(bankCode){
        fetchexternalbankAccountsDeferred = $.Deferred();
      fetchexternalbankAccounts(bankCode,fetchexternalbankAccountsDeferred);
        return fetchexternalbankAccountsDeferred;
      }

    };
  };
  return new ListingModel();
});
