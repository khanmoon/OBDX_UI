define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TransactionsModel = function() {
    var baseService = BaseService.getInstance(),
      fetchEStatementStatusDeferred, fetchEStatementStatus = function(accountType, accountId,module, deferred) {
        var params = {
          accountType: accountType,
          accountId: accountId,
          module : module
        };
         var url;
        if(accountType === "deposit")
           url ="accounts/{accountType}/{accountId}/preferences/eStatement;module={module}";
         else
         url = "accounts/{accountType}/{accountId}/preferences/eStatement";

        var options = {
          url:url,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.fetch(options, params);
      },

      fetchTransactionDetailsDeffered, fetchTransactionDetails = function(accNo, type, media, mediaFormat,module,deffered,search,isDownload) {
        var temp = JSON.parse(search);
        var parameters = {
          "type": type,
          "accNo": accNo,
          "searchBy": temp.searchBy,
          "fromDate": temp.searchBy === "SPD" ? temp.fromDate : null,
          "toDate": temp.searchBy === "SPD" ? temp.toDate : null,
          "transactionType": temp.transactionType,
          "referenceNo": temp.referenceNo,
          "fromAmount": temp.fromAmount,
          "toAmount": temp.toAmount,
          "module" : module
        };
        var url;
        if(type==="deposit")
        url = "accounts/{type}/{accNo}/transactions;module={module}?searchBy={searchBy}&fromDate={fromDate}&toDate={toDate}&transactionType={transactionType}&referenceNo={referenceNo}&fromAmount={fromAmount}&toAmount={toAmount}";
      else
        url ="accounts/{type}/{accNo}/transactions?searchBy={searchBy}&fromDate={fromDate}&toDate={toDate}&transactionType={transactionType}&referenceNo={referenceNo}&fromAmount={fromAmount}&toAmount={toAmount}";
        var options = {
          url: url,
          success: function(data) {
            deffered.resolve(data);
          },
          error: function(data) {
            deffered.reject(data);
          }
        };
        if (isDownload) {
          options.url += "&media=" + media + "&mediaFormat=" + mediaFormat;
          baseService.downloadFile(options, parameters);
        } else {
          baseService.fetch(options, parameters);
        }
      };
    var fetchMediaTypeDeferred, fetchMediaType = function(deferred) {
      var options = {
        url: "enumerations/mediatype",
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
      fetchTransactionDetails: function(accNo, type, media, mediaFormat,module,params) {
        fetchTransactionDetailsDeffered = $.Deferred();
        fetchTransactionDetails(accNo, type, media, mediaFormat,module,fetchTransactionDetailsDeffered, params);
        return fetchTransactionDetailsDeffered;
      },
      fetchMediaType: function() {
        fetchMediaTypeDeferred = $.Deferred();
        fetchMediaType(fetchMediaTypeDeferred);
        return fetchMediaTypeDeferred;
      },
      downloadStatement: function(accNo, type, media, mediaFormat, module,params) {
        fetchTransactionDetails(accNo, type, media, mediaFormat, module,fetchTransactionDetailsDeffered,params, true);
      },
      fetchEStatementStatus: function(accountType, accountId, module) {
        fetchEStatementStatusDeferred = $.Deferred();
        fetchEStatementStatus(accountType, accountId, module, fetchEStatementStatusDeferred);
        return fetchEStatementStatusDeferred;
      }
    };
  };
  return new TransactionsModel();
});
