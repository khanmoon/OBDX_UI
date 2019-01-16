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
      fetchTransactionDetails: function(accNo, type, params, count) {
        var parameters = {
          "type": type,
          "accNo": accNo,
          "count": count
        };
        var options = {
          url: "accounts/{type}/{accNo}/transactions?searchBy=LNT&noOfTransactions={count}",
          showMessage: false,
          selfLoader: true
        };
        if(Constants.userSegment === "ADMIN"){
          return baseService.fetchJSON({url:"design-dashboard/data/accounts/recent-account-transactions"});
        }
          return baseService.fetch(options,parameters);


      },
      fetchAccounts:function(){
        var options = {
          url: "accounts",
          showMessage: false
        };
        if(Constants.userSegment==="ADMIN"){
          options.url="design-dashboard/data/accounts/demand-deposit";
          return baseService.fetchJSON(options);
        }
          return baseService.fetch(options);

      }
    };
  };
  return new AccountActivity();
});
