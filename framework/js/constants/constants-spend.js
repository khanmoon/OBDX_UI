define([], function() {
  "use strict";
  return {
    URL: {
      GET_CATEGORY_LIST: "expenditures/categories?categoryName={categoryName}&categoryCode={categoryCode}",
      CREATE_CATEGORY: "expenditures/categories",
      READ_CATEGORY: "expenditures/categories/{categoryId}",
      EDIT_CATEGORY: "expenditures/categories/{categoryId}"
    }
  };
});