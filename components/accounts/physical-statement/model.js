define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var physicalStatement = function() {
    /* Extending predefined baseService to get ajax functions. */
    var params, baseService = BaseService.getInstance();
    var requestPhysicalStatementDeferred, requestPhysicalStatement = function(accountType, accountId, payload,module, deferred) {
      params = {
        accountType: accountType,
        accountId: accountId,
        module:module
      };
      var url;
        if(accountType==="deposit")
           url ="accounts/{accountType}/{accountId}/adhocStatement;module={module}";
         else
         url = "accounts/{accountType}/{accountId}/adhocStatement";
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
      baseService.add(options, params);
    };
    return {
      requestPhysicalStatement: function(accountType, accountId, payload,module) {
        requestPhysicalStatementDeferred = $.Deferred();
        requestPhysicalStatement(accountType, accountId, payload,module, requestPhysicalStatementDeferred);
        return requestPhysicalStatementDeferred;
      }
    };
  };
  return new physicalStatement();
});
