define(
  [],
  function() {
    "use strict";
    var SpendCategories = function() {
      return {
        root: {

          tableheader: {
            category: "Category",
            subcategories: "Sub Category",
            action: "Action",
            caption: "Spend Categories"
          },
          image: {
            alt: "successful"
          },
          alt: {
            editTitle: "Edit",
            editAlt: "Edit"
          },
          spendCategory: {
            addcategory: "Add Category",
            edit: "Edit Category",
            errorMessage: "Alphanumeric values with space and special characters as $ & , . _ : between length 1-40 are allowed."
          },
          add: "Add",
          nodata: "No data",
          back: "Back",
          backToDashboard: "Back to dashboard",
          added: "added",
          edited: "updated",
          successmsg: "Category {action} successfully.",
          title: "Manage My Categories",
          subtitle: "You can Add Your Custom Categories and Manage Them Here"

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
    return new SpendCategories();
  }
);