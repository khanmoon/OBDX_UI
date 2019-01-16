define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var eStatementModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var params, baseService = BaseService.getInstance();
    var getEstatementsListDeferred, getEstatementsList = function(accountType, accountId, statementYear, statementMonth, module,deferred) {
       var url;
        if(accountType==="deposit")
           url ="accounts/" + accountType + "/" + accountId + "/statements;module="+module+"?statementYear=" + statementYear + "&statementMonth=" + statementMonth;
         else
         url = "accounts/" + accountType + "/" + accountId + "/statements?statementYear=" + statementYear + "&statementMonth=" + statementMonth;

      var options = {
        url:url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options, params);
    };

    var downLoadStatementDeferred, downLoadStatement = function(accountType, accountId, statementNo, module,deferred) {
      var url;
        if(accountType==="deposit")
           url ="accounts/" + accountType + "/" + accountId + "/statements/" + statementNo + "/download;module="+module+"?media=application/pdf";
         else
         url = "accounts/" + accountType + "/" + accountId + "/statements/" + statementNo + "/download?media=application/pdf";
      var options = {
        url: url,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.downloadFile(options, params);
    };
    return {
      getEstatementsList: function(accountType, accountId, statementYear, statementMonth,module) {
        getEstatementsListDeferred = $.Deferred();
        getEstatementsList(accountType, accountId, statementYear, statementMonth,module,getEstatementsListDeferred);
        return getEstatementsListDeferred;
      },
      downLoadStatement: function(accountType, accountId, statementNo,module) {
        downLoadStatementDeferred = $.Deferred();
        downLoadStatement(accountType, accountId, statementNo,module,downLoadStatementDeferred);
        return downLoadStatementDeferred;
      }
    };
  };
  return new eStatementModel();
});
