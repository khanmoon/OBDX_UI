define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var spendCategoryEditRB = function() {
    return {
      root: {
        resource: {

          spendCategory: {
            editCategoryConfirm: "Spend Category Maintenance",
            addsubalt: "Add sub category",
            subcatdesc: "Sub category Name",
            subcategorylabel: "Sub Category Name",
            categoryCode: "Category Code",
            subCategoryCode : "Subcategory Code",
            subCategoryName : "Subcategory Name",
            subCategoryDetails: "Add Sub Categories (optional)",
            categoryName: "Category Name",
            edit: "Edit Category",
            add : "Add",
            title : "Spend Category Maintenance",
            reviewHeaderMsg: "You initiated a request for Spend Category Maintenance. Please review details before you confirm!"
          },

          alt: {
            add: "Click to Add Category",
            addText: "Click to Add Category",
            remove: "Click to Remove Category",
            removeText: "Click to Remove Category"
          },

          common: Generic.common

        }

      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new spendCategoryEditRB();
});