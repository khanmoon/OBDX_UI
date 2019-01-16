define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-payments"
], function($, BaseService) {
  "use strict";
  var outwardRemittanceModel = function() {
    var

      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      getBranchesDeferred, getBranches = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode/",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getDetailDeferred, getDetail = function(refNo, deferred) {
        var options = {
            url: "payments/outwardRemittances/{refNo}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            refNo: refNo
          };
        baseService.fetch(options, params);
      },
      getPurposeDeferred, getPurpose = function(deferred) {
        var options = {
          url: "purposes/PC",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getTransactionsDeferred, getTransactions = function(url, deferred) {
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getHostDateDeferred, getHostDate = function(deferred) {

        var options = {
          url: "payments/currentDate",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchAccountDataDeferred, fetchAccountData = function(taskCode, deferred) {
        var params = {
            taskCode: taskCode
          },
          url = "accounts/demandDeposit";
        if (taskCode) {
          url += "?taskCode={taskCode}";
        }
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      getInternationalCurrencyDeferred, getInternationalCurrencyList = function(deferred) {
        var options = {
          url: "payments/currencies?type=PC_F_IT",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPDFDeferred, fetchPDF = function(refNo) {
        var options = {
            url: "payments/outwardRemittances/{refNo}?media=application/pdf"
          },
          params = {
            refNo: refNo
          };
        baseService.downloadFile(options, params);
      };
    return {
      getDetail: function(refNo) {
        getDetailDeferred = $.Deferred();
        getDetail(refNo, getDetailDeferred);
        return getDetailDeferred;
      },
      getTransactions: function(url) {
        getTransactionsDeferred = $.Deferred();
        getTransactions(url, getTransactionsDeferred);
        return getTransactionsDeferred;
      },
      getInternationalCurrencyList: function() {
        getInternationalCurrencyDeferred = $.Deferred();
        getInternationalCurrencyList(getInternationalCurrencyDeferred);
        return getInternationalCurrencyDeferred;
      },
      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);
        return getBranchesDeferred;
      },
      fetchAccountData: function(taskCode) {
        fetchAccountDataDeferred = $.Deferred();
        fetchAccountData(taskCode, fetchAccountDataDeferred);
        return fetchAccountDataDeferred;
      },
      getPurpose: function() {
        getPurposeDeferred = $.Deferred();
        getPurpose(getPurposeDeferred);
        return getPurposeDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);
        return getHostDateDeferred;
      },
      fetchPDF: function(refNo) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(refNo, fetchPDFDeferred);
        return fetchPDFDeferred;
      }
    };
  };
  return new outwardRemittanceModel();
});