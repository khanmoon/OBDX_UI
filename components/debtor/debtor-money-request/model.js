define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var RequestMoneyModel = function() {
    var Model = function() {
        this.RequestMoneyModel = {
          dictionaryArray: null,
          refLinks: null,
          type: "NONREC",
          frequency: "10",
          startDate: null,
          endDate: null,
          amount: {
            currency: null,
            amount: null
          },
          userReferenceNo: null,
          remarks: null,
          purpose: null,
          debitAccountId: null,
          statusType: null,
          payerId: null,
          payerType: null,
          sepaDomestic: {
            dictionaryArray: null,
            refLinks: null,
            nominatedAccount: {
              displayValue: null,
              value: null
            },
            oinNumber: null,
            oinDescription: null
          }
        };
      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      getCurrencyDeferred, getCurrency = function(deferred) {
        var options = {
          url: "bankConfiguration",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getDebtorListDeferred, getDebtorList = function(deferred) {
        var options = {
          url: "payments/payerGroup?expand=ALL",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getDebtorSubListDeferred, getDebtorSubList = function(groupId, deferred) {
        var options = {
            url: "payments/payerGroup/{groupId}/payers?types={type}&nickName=nickName",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "groupId": groupId,
            "type": "DEMANDDRAFT",
            "nickName": ""
          };
        baseService.fetch(options, params);
      },
      getAccountListDeferred, getAccountList = function(deferred) {
        var options = {
          url: "accounts/demandDeposit",
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
      initiateRequestMoneyDeferred, initiateRequestMoney = function(model, deferred) {

        var options = {
          url: "payments/instructions/payins/domestic",
          data: model,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      confirmRequestMoneyDeferred, confirmRequestMoney = function(paymentId, deferred) {

        var options = {
            url: "payments/instructions/payins/domestic/{instructionId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            }
          },
          params = {
            "instructionId": paymentId
          };
        baseService.patch(options, params);
      },
      confirmRequestMoneyWithAuthDeferred, confirmRequestMoneyWithAuth = function(paymentId, authKey, deferred) {

        var options = {
            url: "payments/instructions/payins/domestic/{instructionId}/authentication",
            headers: {
              "TOKEN_ID": authKey
            },
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "instructionId": paymentId
          };
        baseService.update(options, params);
      };
    return {

      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getCurrency: function() {
        getCurrencyDeferred = $.Deferred();
        getCurrency(getCurrencyDeferred);
        return getCurrencyDeferred;
      },
      getDebtorList: function() {
        getDebtorListDeferred = $.Deferred();
        getDebtorList(getDebtorListDeferred);
        return getDebtorListDeferred;
      },
      getDebtorSubList: function(groupId) {
        getDebtorSubListDeferred = $.Deferred();
        getDebtorSubList(groupId, getDebtorSubListDeferred);
        return getDebtorSubListDeferred;
      },
      confirmRequestMoneyWithAuth: function(paymentId, authKey) {
        confirmRequestMoneyWithAuthDeferred = $.Deferred();
        confirmRequestMoneyWithAuth(paymentId, authKey, confirmRequestMoneyWithAuthDeferred);
        return confirmRequestMoneyWithAuthDeferred;
      },
      confirmRequestMoney: function(paymentId) {
        confirmRequestMoneyDeferred = $.Deferred();
        confirmRequestMoney(paymentId, confirmRequestMoneyDeferred);
        return confirmRequestMoneyDeferred;
      },
      initiateRequestMoney: function(model) {
        initiateRequestMoneyDeferred = $.Deferred();
        initiateRequestMoney(model, initiateRequestMoneyDeferred);
        return initiateRequestMoneyDeferred;
      },
      getHostDate: function() {
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);
        return getHostDateDeferred;
      },
      getAccountList: function() {
        getAccountListDeferred = $.Deferred();
        getAccountList(getAccountListDeferred);
        return getAccountListDeferred;
      }
    };
  };
  return new RequestMoneyModel();
});