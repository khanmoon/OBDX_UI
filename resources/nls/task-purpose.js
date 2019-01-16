define([], function() {
  "use strict";
  var TaskPurposeLocale = function() {
    return {
      root: {
        header: {
          purposeTaskLanding: "Payment Purpose Mapping",
          purposeTaskHeader: "Purposes",
          mapPurposeCode: "Payment Purpose Mapping",
          taskPurposeMapping: "Payment Purpose Mapping"
        },
        addTask: {
          createTaskPurposeMappingConfirm: "Payment Purpose Mapping",
          updateLinkageConfirm: "Payment Purpose Mapping"
        },
        taskPurpose: {
          review: "Mapping - {reviewTask}",
          reviewHeaderMsg: "You Initaited a request for payment purpose mapping. Please review details before you confirm!",
          createMapping: "Map Purposes",
          paymentType: "Payment Type",
          purposeCode: "Purpose Description",
          taskCodes: "Payment Type",
          mapPurposeCodes: "Map",
          mappedPurpose: "Payment Purpose Mapping",
          updatepurposemsg: "Are you sure you want to update payment purpose mapping for {task}?",
          taskpurposeupdatesuccessmsg: "Successfully updated task purpose mapping for {task}",
          createMappingSuccessMessage: "Payment Purpose Mapping created successfully.",
          mapPurpose: "Please select at least one purpose",
          successful: "Successful"
        },
        common: {
          review: "Review",
          back:"Back",
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
  return new TaskPurposeLocale();
});