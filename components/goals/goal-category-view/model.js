define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var goalCategoryViewModel = function() {
    var Model = function() {

        this.goalCategoryModel = {
          categoryCode: null,
          categoryName: null,
          productId: null,
          expiryDate: null,
          parentCategory: null,
          categoryId: null,
          contentId: null,
          status: null,
          subCategories: null
        };

      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      readCategoryDeferred, readCategory = function(categoryId, deferred) {
        var options = {
            url: "goals/categories/{categoryId}",
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

      getProductsDeferred, getProducts = function(deferred) {
        var options = {
          url: "goals/products",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },

      uploadImageDeffered, uploadImage = function(form, deferred) {
        var options = {
          url: "contents",
          formData: form,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.uploadFile(options);
      },
      readProductDeferred, readProduct = function(productId, deferred) {
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

      updateCategoryDeferred, updateCategory = function(model, categoryId, deferred) {
        var options = {
            url: "goals/categories/{categoryId}",
            data: model,
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            categoryId: categoryId
          };
        baseService.update(options, params);
      },

      retrieveImageDeffered, retrieveImage = function(id, deferred) {
        var options = {
            url: "contents/{id}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "id": id
          };
        baseService.fetch(options, params);
      },
      deleteImageDeffered, deleteImage = function(id, deferred) {
        var options = {
            url: "contents/{id}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "id": id
          };
        baseService.remove(options, params);
      };
    return {

      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      updateCategory: function(payload, categoryId) {
        updateCategoryDeferred = $.Deferred();
        updateCategory(payload, categoryId, updateCategoryDeferred);
        return updateCategoryDeferred;
      },
      getProducts: function() {
        getProductsDeferred = $.Deferred();
        getProducts(getProductsDeferred);
        return getProductsDeferred;
      },
      readCategory: function(categoryId) {
        readCategoryDeferred = $.Deferred();
        readCategory(categoryId, readCategoryDeferred);
        return readCategoryDeferred;
      },
      readProduct: function(productId) {
        readProductDeferred = $.Deferred();
        readProduct(productId, readProductDeferred);
        return readProductDeferred;
      },

      retrieveImage: function(id) {
        retrieveImageDeffered = $.Deferred();
        retrieveImage(id, retrieveImageDeffered);
        return retrieveImageDeffered;
      },
      deleteImage: function(id) {
        deleteImageDeffered = $.Deferred();
        deleteImage(id, deleteImageDeffered);
        return deleteImageDeffered;
      },
      uploadImage: function(form) {
        uploadImageDeffered = $.Deferred();
        uploadImage(form, uploadImageDeffered);
        return uploadImageDeffered;
      }
    };
  };
  return new goalCategoryViewModel();
});