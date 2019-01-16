define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var BudgetList = function BudgetList() {
    var baseService = BaseService.getInstance(),
      modelInitialized = true,
      Model = function() {
        this.Budget = {
          "categoryId": "",
          "amount": {
            "amount": "",
            "currency": ""
          },
          "frequency": "Monthly",
          "periodicity": "",
          "customPeriodicityValue": ""
        };
      },
      budgetListDeferred, budgetList = function(deferred) {
        var options = {
          url: "budget",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      spendListDeferred, spendList = function(startDate, endDate, deferred) {
        var options = {
            url: "expenditures?isSummary=true&fromDate={startDate}&toDate={endDate}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            startDate: startDate,
            endDate: endDate
          };
        baseService.fetch(options, params);
      },
      spendCategoryListDeferred, spendCategoryList = function(deferred) {
        var options = {
          url: "expenditures/categories",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      createBudgetDeferred, createBudget = function(payload, deferred) {
        var options = {
          url: "budget",
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
      updateBudgetDeferred, updateBudget = function(payload, categoryId, versionId, budgetId, deferred) {
        var options = {
            url: "budget/{budgetId};categoryId=" + categoryId + ";versionId=" + versionId,
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            budgetId: budgetId
          };
        baseService.update(options, params);
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
      deleteBudgetDeferred, deleteBudget = function(budgetId, deferred) {
        var options = {
          url: "budget/" + budgetId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.remove(options);
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      budgetList: function() {

        budgetListDeferred = $.Deferred();
        budgetList(budgetListDeferred);
        return budgetListDeferred;
      },
      spendList: function(startDate, endDate) {

        spendListDeferred = $.Deferred();
        spendList(startDate, endDate, spendListDeferred);
        return spendListDeferred;
      },
      spendCategoryList: function() {

        spendCategoryListDeferred = $.Deferred();
        spendCategoryList(spendCategoryListDeferred);
        return spendCategoryListDeferred;
      },
      createBudget: function(payload) {

        createBudgetDeferred = $.Deferred();
        createBudget(payload, createBudgetDeferred);
        return createBudgetDeferred;
      },
      updateBudget: function(payload, categoryId, versionId, budgetId) {

        updateBudgetDeferred = $.Deferred();
        updateBudget(payload, categoryId, versionId, budgetId, updateBudgetDeferred);
        return updateBudgetDeferred;
      },
      deleteBudget: function(budgetId) {

        deleteBudgetDeferred = $.Deferred();
        deleteBudget(budgetId, deleteBudgetDeferred);
        return deleteBudgetDeferred;
      },
      getHostDate: function() {
        hostDateDeferred = $.Deferred();
        getHostDate(hostDateDeferred);
        return hostDateDeferred;
      }
    };
  };
  return new BudgetList();
});