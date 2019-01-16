define([], function() {
  "use strict";
  var BillerCategoryLocale = function() {
    return {
      root: {
        header: {
          lending: "Biller Category Mapping",
          inquir: "Biller Category Mapping",
          mapBiller: "Biller Category Mapping",
          review: "Review",
          purposeTaskLanding: "Payment Purpose Mapping",
          mapPurposeCode: "Map Purpose",
          purposeTaskHeader: "Purposes",
          billercategoryheader: "Biller Category",
          info: "Info!"
        },
        billerCategory: {
          reviewHeaderMsg: "You Initaited a request for mapping Billers. Please review details before you confirm!",
          mapBillerConfirm: "Transaction",
          mapBiller: "Map Biller",
          addBiller: "Add Biller",
          category: "Biller Category",
          billerName: "Biller Name",
          billerCode: "Biller Code",
          billerdelete: "Delete Biller",
          altDelete: "Click here to delete Category",
          titleDelete: "Click here to delete Category",
          deleteBiller: "Are you sure you want to delete the Biller-  {billerId} ?",
          updateBiller: "Are you sure you want to update the Biller-  {billerId} ?",
          billers: "Billers",
          alt: "Click here to manage Categories",
          title: "Click here to manage Categories",
          altBiller: "Click here to remove biller",
          titleBiller: "Click here to remove biller",
          manage: "Manage Category",
          categorytitle: "Manage Categories - Retail",
          billerCategory: "Biller Category",
          billerCount: "Mapped billers",
          mappedBillers: "List of billers",
          addnew: "Add Category",
          deletecategorymsg: "Are you sure you want to delete the category -  {categoryId} ?",
          successful: "Successful",
          mappingSuccess: "Biller has been successfully mapped",
          noCategoriesmsg: "There are no categories to display. Please add a new category",
          noBillersmsg: "There are no billers to map!",
          billerMap: "Biller Mapping",
          addMoreBiller:"Add more",
          action:"Action"
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
          delete: "Delete",
          actionType: "Action Type",
          select: "Please select",
          save: "Save",
          read: "Read",
          search: "Search",
          ok: "Ok",
          remove: "Remove",
          create: "Create New",
          add: "Add more",
          successful: "Successful",
          noRecords: "No Records Found",
          billercode: "Biller code",
          back: "Back"
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