define(["baseService", "jquery"], function(BaseService, $) {
  "use strict";
  var downloadStatementModel = function() {
    /* Extending predefined baseService to get ajax functions. */
    var params, baseService = BaseService.getInstance();

    var getpdfDeferred, getpdf = function(cardId, statementMonth, statementYear, deferred) {
      params = {
        "cardId": cardId,
        "statementMonth": statementMonth,
        "statementYear": statementYear
      };
      var options = {
        url: "accounts/cards/credit/{cardId}/statements/download??statementMonth={statementMonth}&statementYear={statementYear}&media=application/pdf",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.downloadFile(options);
    };
    var getEstatementsListDeferred, getEstatementsList = function(cardId, statementMonth, statementYear, deferred) {
      params = {
        "cardId": cardId,
        "statementMonth": statementMonth,
        "statementYear": statementYear
      };
      var options = {
        url: "accounts/cards/credit/{cardId}/statements?statementMonth={statementMonth}&statementYear={statementYear}",
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
      getpdf: function(cardId, statementMonth, statementYear) {
        getpdfDeferred = $.Deferred();
        getpdf(cardId, statementMonth, statementYear, getpdfDeferred);
        return getpdfDeferred;
      },
      getEstatementsList: function(cardId, statementMonth, statementYear) {
        getEstatementsListDeferred = $.Deferred();
        getEstatementsList(cardId, statementMonth, statementYear, getEstatementsListDeferred);
        return getEstatementsListDeferred;
      }
    };
  };
  return new downloadStatementModel();
});