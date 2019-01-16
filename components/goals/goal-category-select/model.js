define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var goalCalculatorSelectModel = function() {
    var Model = function() {
        this.transferObject = {
          categoryId: null,
          subCategoryId: null,
          categoryName: null,
          productDetails: null,
          goalAmount: null,
          initialAmount: null,
          content: null
        };

      },
      modelInitialized = true,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      getCategoryListDeferred, getCategoryList = function(status, deferred) {
        var options = {
          url: "goals/categories?status=" + status,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },

      readCategoryDeferred, readCategory = function(categoryId, deferred) {
        var options = {
            url: "goals/categories/" + categoryId,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            categoryId: categoryId
          };
        baseService.fetch(options, params);
      },

      fireBatchDeferred, fireBatch = function(subRequestList, deferred) {
        var options = {
          headers: {
            "BATCH_ID": "5678"
          },
          url: "batch/",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {}, subRequestList);
      },

      getProductDeferred, getProduct = function(productId, deferred) {
        var options = {
            url: "goals/products/{productId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            productId: productId
          };
        baseService.fetch(options, params);
      },

      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()
      },
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function() {
        return new Model();
      },

      getProduct: function(productId) {
        objectInitializedCheck();
        getProductDeferred = $.Deferred();
        getProduct(productId, getProductDeferred);
        return getProductDeferred;
      },
      readCategory: function(categoryId) {
        objectInitializedCheck();
        readCategoryDeferred = $.Deferred();
        readCategory(categoryId, readCategoryDeferred);
        return readCategoryDeferred;
      },
      fireBatch: function(subRequestList) {
        fireBatchDeferred = $.Deferred();
        fireBatch(subRequestList, fireBatchDeferred);
        return fireBatchDeferred;
      },
      getCategoryList: function(status) {
        objectInitializedCheck();
        getCategoryListDeferred = $.Deferred();
        getCategoryList(status, getCategoryListDeferred);
        return getCategoryListDeferred;
      }
    };
  };
  return new goalCalculatorSelectModel();
});