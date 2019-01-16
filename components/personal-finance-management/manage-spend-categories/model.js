define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var SpendCategories = function SpendCategories() {

    var baseService = BaseService.getInstance(),

      listcategoriesDeferred, listcategories = function(deferred) {
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

      };

    return {
      listcategories: function() {
        listcategoriesDeferred = $.Deferred();
        listcategories(listcategoriesDeferred);
        return listcategoriesDeferred;
      }

    };
  };

  return new SpendCategories();
});