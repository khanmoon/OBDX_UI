define(["baseService", "jquery"], function(BaseService,$) {
  "use strict";
  var AccordionModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var params, baseService = BaseService.getInstance();
    var subscribeEStatementDeferred, subscribeEStatement = function(accountType, accountId, payload, deferred) {
      params = {
        accountType: accountType,
        accountId: accountId
      };
      var options = {
        url: "accounts/{accountType}/{accountId}/preferences/eStatement",
        data: payload,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.update(options, params);
    };
    var getQuickLinksDeferred, getQuickLinks = function(deferred, url) {
      var options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetchJSON(options);
    };
    var getInactiveAccountsDeferred, getInactiveAccounts = function(url, deferred) {
      var options = {
        showMessage: false,
        url: url,
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
      subscribeEStatement: function(url, accountId, payload) {
        subscribeEStatementDeferred = $.Deferred();
        subscribeEStatement(url, accountId, payload, subscribeEStatementDeferred);
        return subscribeEStatementDeferred;
      },
      getQuickLinks: function(url) {
        getQuickLinksDeferred = $.Deferred();
        getQuickLinks(getQuickLinksDeferred, url);
        return getQuickLinksDeferred;
      },
      getInactiveAccounts: function(url) {
        getInactiveAccountsDeferred = $.Deferred();
        getInactiveAccounts(url, getInactiveAccountsDeferred);
        return getInactiveAccountsDeferred;
      }
    };
  };
  return new AccordionModel();
});
