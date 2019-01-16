define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var TransactionList = function TransactionList() {

    var model = function() {

        this.recategorizationPayload = {
            transactionReferenceId: null,
            subSequenceId: null,
            categoryId: null,
            subCategoryId: null,
            splitId: null
          };

          this.createSpendCategoryPayload = {
            code: null,
            name: null,
            description: null,
            contentId: null,
            subCategoryList: []
          };

        this.splitObject = {
          categoryId: [],
          subcategoryId: [],
          amount: "",
          subcategoryList: []
        };

        this.splitPayloadElement = {
          categoryId: null,
          subcategoryId: null,
          transactionAmount: {
            currency: "",
            amount: 0
          }
        };

        this.splitPayload = {
          splitTransactions: []
        };
      },

      baseService = BaseService.getInstance(),

      listTransactionsDeferred, listTransactions = function(filter, deferred) {
        var options = {
          url: "expenditures" + filter,

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);

      },

      listAllCategoriesDeferred, listAllCategories = function(deferred) {
        var options = {
          url: "expenditures/categories?expand=ALL",

          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);

      },

      recategorizeTransactionDeferred, recategorizeTransaction = function(payload, deferred) {
        var options = {
          url: "expenditures",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);

      },

      addCategoryDeferred, addCategory = function(payload, deferred) {
        var options = {
          url: "expenditures/categories",

          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);

      },

      hostDateDeferred, getHostDate = function(deferred) {

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

      splitxnDeferred, splitxn = function(payload, txnId, subSeqId, deferred) {
        var options = {
          url: "expenditures/" + txnId + ";subSequenceId=" + subSeqId + "/split",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);

      },

      listAccountsDeferred, listAccounts = function(deferred) {
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
      };

    return {
      getNewModel: function() {
        return new model();
      },

      listTransactions: function(filter) {
        listTransactionsDeferred = $.Deferred();
        listTransactions(filter, listTransactionsDeferred);
        return listTransactionsDeferred;
      },
      listAllCategories: function() {
        listAllCategoriesDeferred = $.Deferred();
        listAllCategories(listAllCategoriesDeferred);
        return listAllCategoriesDeferred;
      },
      listAccounts: function() {
        listAccountsDeferred = $.Deferred();
        listAccounts(listAccountsDeferred);
        return listAccountsDeferred;
      },
      recategorizeTransaction: function(payload) {
        recategorizeTransactionDeferred = $.Deferred();
        recategorizeTransaction(payload, recategorizeTransactionDeferred);
        return recategorizeTransactionDeferred;
      },
      addCategory: function(payload) {
        addCategoryDeferred = $.Deferred();
        addCategory(payload, addCategoryDeferred);
        return addCategoryDeferred;
      },
      splitxn: function(payload, txnId, subSeqId) {
        splitxnDeferred = $.Deferred();
        splitxn(payload, txnId, subSeqId, splitxnDeferred);
        return splitxnDeferred;
      },
      getHostDate: function() {
        hostDateDeferred = $.Deferred();
        getHostDate(hostDateDeferred);
        return hostDateDeferred;
      }
    };
  };

  return new TransactionList();
});