define([
    "jquery",
    "baseService"
], function ($, BaseService) {
    "use strict";
    var ManageCategoryModel = function () {
      var baseService = BaseService.getInstance(),
          Model = function() {
              this.CategoryDetails = {
                 "id":null,
                 "name":null,
                 "priority":null,
                 "logo": {
                    "value": "",
                    "displayValue": ""
                 },
                 "billerCount": null,
                 "priorityUpdateFlag": null
              };
          };
      var fetchCategoryDeferred, fetchCategory = function (deferred) {
          var options = {
              url: "categories",
              success: function (data) {
                  deferred.resolve(data);
              }
          };
          baseService.fetch(options);
      },
      fireBatchDeferred,fireBatch = function(deferred, subRequestList, type) {
        var options = {
          url: "batch",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {type: type}, subRequestList);
      },
      deleteCategoryDeffered, deleteCategory = function(categoryId, deferred) {
        var options = {
          url: "categories/" + categoryId,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.remove(options);
      },
      updateCategoryDeferred, updateCategory = function(categoryId, model, deferred) {
        var options = {
          url: "categories/" + categoryId,
          data: model,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
      }, uploadImageDeffered, uploadImage = function(form, deferred) {
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
       createCategoryDeferred, createCategory = function(model, deferred) {
          var options = {
            url: "categories",
            data: model,
            success: function(data, status, jqXhr) {
              deferred.resolve(data, status, jqXhr);
            }
          };
          baseService.add(options);
        };
        return {
            getNewModel: function() {
                return new Model();
            },
            fetchCategory: function () {
              fetchCategoryDeferred = $.Deferred();
              fetchCategory(fetchCategoryDeferred);
              return fetchCategoryDeferred;
            },
            fireBatch: function(subRequestList, type) {
                fireBatchDeferred = $.Deferred();
                fireBatch(fireBatchDeferred, subRequestList, type);
                return fireBatchDeferred;
            },
            deleteCategory: function(categoryId) {
                deleteCategoryDeffered = $.Deferred();
                deleteCategory(categoryId, deleteCategoryDeffered);
                return deleteCategoryDeffered;
            },
            updateCategory: function(categoryId, model) {
                updateCategoryDeferred = $.Deferred();
                updateCategory(categoryId, model, updateCategoryDeferred);
                return updateCategoryDeferred;
            },
            uploadImage: function(form) {
                uploadImageDeffered = $.Deferred();
                uploadImage(form, uploadImageDeffered);
                return uploadImageDeffered;
            },
            createCategory: function(model) {
                createCategoryDeferred = $.Deferred();
                createCategory(model, createCategoryDeferred);
                return createCategoryDeferred;
            }
        };
    };
    return new ManageCategoryModel();
});
