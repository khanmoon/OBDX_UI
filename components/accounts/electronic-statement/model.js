define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var eStatementModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var params, baseService = BaseService.getInstance();
    var subscribeEStatementDeferred, subscribeEStatement = function(accountType, accountId, payload,module,deferred) {
      params = {
        accountType: accountType,
        accountId: accountId,
        module :module
      };
       var url;
        if(accountType==="deposit")
           url ="accounts/{accountType}/{accountId}/preferences/eStatement;module={module}";
         else
         url = "accounts/{accountType}/{accountId}/preferences/eStatement";
      var options = {
        url: url,
        data: payload,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        },
        error: function(data, status, jqXhr) {
          deferred.reject(data, status, jqXhr);
        }
      };
      baseService.update(options, params);
    };
    var getEmailForSubscriptionDeferred, getEmailForSubscription = function(partyId, deferred) {
      params = {
        "partyId": partyId
      };
      var options = {
        url: "parties/{partyId}/contactPoints",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };

    return {
      subscribeEStatement: function(url, accountId, payload,module) {
        subscribeEStatementDeferred = $.Deferred();
        subscribeEStatement(url, accountId, payload,module,subscribeEStatementDeferred);
        return subscribeEStatementDeferred;
      },
      getEmailForSubscription: function(partyId) {
        getEmailForSubscriptionDeferred = $.Deferred();
        getEmailForSubscription(partyId, getEmailForSubscriptionDeferred);
        return getEmailForSubscriptionDeferred;
      }
    };
  };
  return new eStatementModel();
});
