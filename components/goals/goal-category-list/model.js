define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var goalCategoryListModel = function() {
    var baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/

      getCategoryListDeferred, getCategoryList = function(categoryName, categoryCode, status, deferred) {
        var options = {
            url: "goals/categories?categoryName={categoryName}&categoryCode={categoryCode}&status={status}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            categoryName: categoryName,
            categoryCode: categoryCode,
            status: status
          };
        baseService.fetch(options, params);
      };
    return {

      getCategoryList: function(categoryName, categoryCode, status) {
        getCategoryListDeferred = $.Deferred();
        getCategoryList(categoryName, categoryCode, status, getCategoryListDeferred);
        return getCategoryListDeferred;
      }
    };
  };
  return new goalCategoryListModel();
});