define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var billPaymentsModel = function() {
    var Model = function() {
        this.payBillModel = {
            amount: {
              currency: null,
              amount: null
            },
            valueDate: null,
            userReferenceNo: "",
            remarks: "",
            purpose: "",
            debitAccountId: {
              displayValue: null,
              value: null
            },
            status: null,
            billerId: null,
            billNumber: null,
            billDate: null,
            consumerNumber: null,
            relationshipNumber: null
          };

          this.favoritesModel = {
            id: null,
            transctionType: "BILLPAYMENT",
            payeeId: null,
            amount: {
              currency: null,
              amount: null
            },
            debitAccountId: {
              displayValue: null,
              value: null
            },
            relationshipNumber: null,
            remarks: null,
            payeeAccountName: null,
            billerCategory: null
          };
      },
      baseService = BaseService.getInstance(),
      getBillersDeferred, getBillers = function(deferred) {
        var options = {
          url: "payments/registeredBillers",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      listAccessPointDeferred, listAccessPoint = function(deferred) {
        var options = {
          url: "accessPoints",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      getCurrencyDeferred, getCurrency = function(deferred) {
        var options = {
          url: "payments/currencies?type=BILLPAYMENT",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBillerNamesDeferred, getBillerNames = function(deferred) {
        var options = {
          url: "payments/billers?categoryType=ALL",
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
      getBillPaymentDetailsDeferred, getBillPaymentDetails = function(paymentId, deferred) {
        var options = {
          url: "payments/transfers/bill/" + paymentId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      deleteFavouriteDeferred, deleteFavourite = function(paymentId, transactionType, deferred) {

        var options = {
          url: "payments/favorites?transactionId=" + paymentId + "&&type=" + transactionType,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.remove(options);
      },
      paybillDeferred, paybill = function(model, deferred) {
        var options = {
          url: "payments/transfers/bill",
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
      getAccountsDeferred, getAccounts = function(deferred) {
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
      confirmPaymentDeferred, confirmPayment = function(paymentId, transactionId, deferred) {

        var options = {
          url: "payments/transfers/bill/" + paymentId,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        if (transactionId) {
          options.headers = {};
          options.headers.TRANSACTION_REFERENCE_NO = transactionId;
        }
        baseService.patch(options);
      },
      confirmPaymentWithAuthDeferred, confirmPaymentWithAuth = function(paymentId, authKey, deferred) {

        var options = {
          url: "payments/transfers/bill/" + paymentId + "/authentication",
          headers: {
            "TOKEN_ID": authKey
          },
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      addFavoritesDeferred, addFavorites = function(model, deferred) {

        var options = {
          url: "payments/favorites",
          data: model,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.add(options);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getBillers: function() {

        getBillersDeferred = $.Deferred();
        getBillers(getBillersDeferred);
        return getBillersDeferred;
      },
      getCurrency: function() {

        getCurrencyDeferred = $.Deferred();
        getCurrency(getCurrencyDeferred);
        return getCurrencyDeferred;
      },
      listAccessPoint: function() {
        listAccessPointDeferred = $.Deferred();
        listAccessPoint(listAccessPointDeferred);
        return listAccessPointDeferred;
      },
      getAccounts: function() {

        getAccountsDeferred = $.Deferred();
        getAccounts(getAccountsDeferred);
        return getAccountsDeferred;
      },
      paybill: function(model) {

        paybillDeferred = $.Deferred();
        paybill(model, paybillDeferred);
        return paybillDeferred;
      },
      getBillerNames: function() {

        getBillerNamesDeferred = $.Deferred();
        getBillerNames(getBillerNamesDeferred);
        return getBillerNamesDeferred;
      },
      confirmPayment: function(paymentId, transactionId) {

        confirmPaymentDeferred = $.Deferred();
        confirmPayment(paymentId, transactionId, confirmPaymentDeferred);
        return confirmPaymentDeferred;
      },
      deleteFavourite: function(paymentId, transactionType) {

        deleteFavouriteDeferred = $.Deferred();
        deleteFavourite(paymentId, transactionType, deleteFavouriteDeferred);
        return deleteFavouriteDeferred;
      },
      addFavorites: function(model) {

        addFavoritesDeferred = $.Deferred();
        addFavorites(model, addFavoritesDeferred);
        return addFavoritesDeferred;
      },
      getHostDate: function() {

        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);
        return getHostDateDeferred;
      },
      fetchBankConfig: function() {
        return baseService.fetch({
          url: "bankConfiguration"
        });
      },
      confirmPaymentWithAuth: function(paymentId, authKey) {

        confirmPaymentWithAuthDeferred = $.Deferred();
        confirmPaymentWithAuth(paymentId, authKey, confirmPaymentWithAuthDeferred);
        return confirmPaymentWithAuthDeferred;
      },
      getBillPaymentDetails: function(paymentId) {

        getBillPaymentDetailsDeferred = $.Deferred();
        getBillPaymentDetails(paymentId, getBillPaymentDetailsDeferred);
        return getBillPaymentDetailsDeferred;
      }
    };
  };
  return new billPaymentsModel();
});
