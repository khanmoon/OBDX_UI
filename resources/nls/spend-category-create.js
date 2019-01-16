define(
  ["ojL10n!resources/nls/generic"],
  function(Generic) {
    "use strict";
    var spendCategoryCreateRB = function() {
      return {
        root: {
          resource: {

            spendCategory: {
              addCategoryConfirm: "Spend Category Maintenance",
              subcatdesc: "Sub category Name",
              categoryName: "Category Name",
              categoryCode: "Category Code",
              addsubalt: "Add sub category",
              subCategoryName: "Sub Category Name",
              subCategoryCode: "Sub Category Code",
              subcategorylabel: "Sub Category Name",
              subCategoryDetails: "Add Sub Categories (optional)",
              addcategory: "Add Category",
              header: "Spend Category Maintenance",
              backWarning1: "Are you sure you want to cancel",
              deletemsg: "Click to delete sub category details",
              deleteIconTitle: "Click to delete sub category details",
              tableMessage: "Spend Subcategory Create List",
              add : "Add",
              reviewHeaderMsg: "You initiated a request for Spend Category Maintenance. Please review details before you confirm!"
            },

            alt: {
              addTitle: "Click to Add Category",
              addAlt: "Click to Add Category",
              removeTitle: "Click to Remove Category",
              removeAlt: "Click to Remove Category"
            },

            recategorize: {
              cancelcategoryaddmsg: "No, I do not want to Add a New Category"
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
    return new spendCategoryCreateRB();
  }
);