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
          subCategoryList: []
        };

      },
      baseService = BaseService.getInstance();

    var addCategoryDeferred, addCategory = function(model, deferred) {
      var options = {
        url: "expenditures/categories",

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
      getNewModel: function() {
        return new Model();
      },
      addCategory: function(model) {
        addCategoryDeferred = $.Deferred();
        addCategory(model, addCategoryDeferred);
        return addCategoryDeferred;
      }
    };
  };

  return new spendCategoryModel();
});