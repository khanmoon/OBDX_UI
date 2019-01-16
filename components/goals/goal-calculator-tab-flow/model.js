define([], function() {
  "use strict";
  var goalCategoryModel = function() {
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
    };
    return {
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new goalCategoryModel();
});