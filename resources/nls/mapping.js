define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var IndexLocale = function() {
    return {
      root: {
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
          update: "Update",
          search: "Search",
          ok: "Ok",
          remove: "Remove",
          create: "Create New",
          add: "Add more",
          successful: "Successful",
          noRecords: "No Records Found"
        },
        mapping: {
          biller_title: "Biller Category Mapping",
          taskpurpose_title: "Payment Purpose Mapping"
        },
        header: {
          lending: "Biller Category Mapping",
          inquir: "Biller Category Mapping",
          mapBiller: "Map",
          review: "Review",
          purposeTaskLanding: "Payment Purpose Mapping",
          mapPurposeCode: "Map Purpose",
          purposeTaskHeader: "Purposes",
          billercategoryheader: "Biller Category"
        },
        billerCategory: {
          mapBiller: "+ Map Biller",
          addBiller: "Add Biller",
          category: "Biller Category",
          billerName: "Biller Name",
          billerCode: "Biller Code",
          deleteBiller: "Are you sure you want to delete the Biller-  {billerId} ?",
          updateBiller: "Are you sure you want to update the Biller-  {billerId} ?",
          info: "Biller Information",
          manage: "Manage Category",
          categorytitle: "Manage Categories - Retail",
          billerCategory: "Biller Category",
          billerCount: "Mapped billers",
          mappedBillers: "List of billers",
          addnew: "Add Category",
          deletecategorymsg: "Are you sure you want to delete the category -  {categoryId} ?",
          successful: "Successful",
          mappingSuccess: "Biller has been successfully mapped",
          noCategoriesmsg: "There are no categories to display. Please add a new category"
        },
        taskPurpose: {
          createMapping: "+Map Purposes",
          paymentType: "Payment Type",
          purposeCode: "Purpose Description",
          taskCodes: "Payment Type",
          mapPurposeCodes: "Map",
          mappedPurpose: "Payment Purpose Mapping",
          updatepurposemsg: "Are you sure you want to update task purpose mapping for {task}?",
          taskpurposeupdatesuccessmsg: "Successfully updated task purpose mapping for {task}",
          createMappingSuccessMessage: "Payment Purpose Mapping created successfully.",
          review: "Review Mapping - {reviewTask}",
          mapPurpose: "Please select at least one purpose"
        },
        enumerations: {},
        generic: Generic
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
  return new IndexLocale();
});