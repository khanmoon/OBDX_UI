define([], function() {
  "use strict";
  var BillerCategoryLocale = function() {
    return {
      root: {
        billerCategory: {
          mapBiller: "+ Map Biller",
          addBiller: "Add Biller",
          category: "Biller Category",
          billerName: "Biller Name",
          billerCode: "Biller Code",
          mapbillerToCategory:"Map Biller",
          deleteBiller: "Are you sure you want to delete the Biller-  {billerId} ?",
          updateBiller: "Are you sure you want to update the Biller-  {billerId} ?",
          info: "Biller Information",
          manage: "Manage Category",
          categorytitle: "Biller Category Mapping",
          alt:"Delete Biller Category",
          title:"Delete Biller Category",
          billerCategory: "Biller Category",
          billerCount: "Mapped billers",
          action:"Action",
          mappedBillers: "List of billers",
          addnew: "Add Category",
          deletecategorymsg: "Are you sure you want to delete the category -  {categoryId} ?",
          singlebillercategorymsg: "Category has been added successfully.",
          multiplebillercategorymsg: "Categories have been added successfully.",
          successful: "Successful",
          mappingSuccess: "Biller has been successfully mapped",
          header: "Delete Biller Category",
          cancelConfirm :"Are you sure you want to cancel the operation?",
          noCategoriesmsg: "There are no categories to display. Please add a new category"
        },
        common: {
          apply: "Apply",
          cancel: "Cancel",
          done: "Done",
          submit: "Submit",
          continue: "Continue",
          login: "Login",
          confirm: "Confirm",
          edit: "Edit",
          view: "View",
          actionType: "Action Type",
          select: "Please select",
          save: "Save",
          read: "Read",
          search: "Search",
          ok: "Ok",
          delete: "Delete",
          remove: "Remove",
          create: "Create New",
          add: "Add more",
          back:"Back",
          successful: "Successful",
          noRecords: "No Records Found"
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
  return new BillerCategoryLocale();
});