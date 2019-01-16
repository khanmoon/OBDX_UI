define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var newCategoryMaintenanceModel = function() {
    var baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      addCategoriesDeferred, addCategories = function(categoryModel, deferred) {

        var options = {
          data: categoryModel,
          url: "payments/billerCategories",
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      deleteCategoryDeferred, deleteCategory = function(categoryId, deferred) {
        var options = {
          url: "payments/billerCategories/" + categoryId,
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
      addCategories: function(categoryModel) {
        addCategoriesDeferred = $.Deferred();
        addCategories(categoryModel, addCategoriesDeferred);
        return addCategoriesDeferred;
      },
      deleteCategory: function(categoryId) {
        deleteCategoryDeferred = $.Deferred();
        deleteCategory(categoryId, deleteCategoryDeferred);
        return deleteCategoryDeferred;
      }
    };
  };
  return new newCategoryMaintenanceModel();
});