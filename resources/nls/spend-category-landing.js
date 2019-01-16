define(
  [],
  function() {
    "use strict";
    var spendCategoryCreateRB = function() {
      return {
        root: {
          resource: {

            spendCategory: {
              title: "Spend Category Maintenance",
              titleView: "Spend Category",
              categoryName: "Category Name",
              create: "Create",
              enterCategory: "Enter Category",
              enterCode: "Enter Code",
              subCategoryName: "Sub Category Name",
              subCategoryCode: "Sub Category Code",
              subCategoryDetails: "Sub Category Details",
              code: "Code",
              name: "Name",
              alt: "Click here for spend Category {categoryName}",
              landingTitle: "Click here for spend Category {categoryName}",
              categoryCode: "Category Code",
              list: "Category List Details",
              errorMessage: "Alphanumeric values with space and special characters as $ & , . _ : between length 1-40 are allowed.",
              spendSearchTable: "Spend Category List"
            },

            common: {
              add: "Add",
              summary: "Summary",
              edit: "Edit",
              view: "View",
              cancel: "Cancel",
              clear: "Clear",
              search: "Search",
              save: "Save",
              yes: "Yes",
              no: "No",
              ok: "Ok",
              review: "Review",
              confirm: "Confirm",
              back: "Back",
              sucessfull: "Successful",
              done: "Done"
            }

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