define(["baseService", "jquery", "framework/js/constants/constants"], function(BaseService, $, Constants) {
  "use strict";
  var AccountActivity = function() {
    /* Extending predefined baseService to get ajax functions. */
    var baseService = BaseService.getInstance();
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    return {
      fetchExternalTransactionDetails: function(accNo,accType,bankId) {
        var parameters = {
          "accNo": accNo,
          "bankId": bankId,
          "accountType": accType
        };
        var options = {
          url: "externalBankAccounts/{accNo}/transactions?externalBankCode={bankId}&locale=en&accountType={accountType}",
          showMessage: false,
          selfLoader: true
        };
        if (Constants.userSegment === "ADMIN") {
          return baseService.fetchJSON({
            url: "design-dashboard/data/accounts/recent-account-activity"
          });
        }
        return baseService.fetch(options, parameters);
      },
      fetchLocalTransactionDetails: function(accNo, type, count) {
        var parameters = {
          "type": type,
          "accNo": accNo,
          "count": count
        };
        var options = {
          url: "accounts/{type}/{accNo}/transactions?noOfTransactions={count}&searchBy=LNT&locale=en",
          showMessage: false,
          selfLoader: true
        };
        if(Constants.userSegment === "ADMIN"){
          return baseService.fetchJSON({url:"design-dashboard/data/accounts/recent-account-transactions"});
        }
          return baseService.fetch(options,parameters);


      },
      fetchexternalbankAccounts :  function(bankCode) {
        var options = {
          url: "externalBankAccounts?bankCode=" + bankCode
        };
        return baseService.fetch(options);
      },
      fetchAccesstoken : function() {
        var options = {
          url: "accesstokens",
          showMessage: false
        };
        return baseService.fetch(options);
      },
      fetchAccounts: function() {
        var options = {
          url: "accounts",
          showMessage: false
        };
        if (Constants.userSegment === "ADMIN") {
          options.url = "design-dashboard/data/accounts/demand-deposit";
          return baseService.fetchJSON(options);
        }
        return baseService.fetch(options);

      }
    };
  };
  return new AccountActivity();
});
