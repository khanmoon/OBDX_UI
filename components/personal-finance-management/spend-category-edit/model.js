define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var spendCategoryModel = function spendCategoryModel() {

    var Model = function() {

        this.spendCategoryDTO = {
          code: null,
          name: null,
          description: null,
          contentId: null,
          categoryId: null,
          subCategoryList: []
        };

      },
      baseService = BaseService.getInstance();

    var editCategoryDeferred, editCategory = function(model, categoryId, deferred) {
      var options = {
        url: "expenditures/categories/" + categoryId,

        data: model,
        success: function(data, status, jqXHR) {
          deferred.resolve(data, status, jqXHR);
        },
        error: function(data, status, jqXHR) {
          deferred.reject(data, status, jqXHR);
        }
      };
      baseService.update(options);

    };

    return {
      getNewModel: function() {
        return new Model();
      },
      editCategory: function(model, categoryId) {
        editCategoryDeferred = $.Deferred();
        editCategory(model, categoryId, editCategoryDeferred);
        return editCategoryDeferred;
      }
    };
  };

  return new spendCategoryModel();
});