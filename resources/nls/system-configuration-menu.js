define([], function() {
  "use strict";
  var SystemConfigurationMenuLocale = function() {
    return {
      root: {
        buttons: {
          save: "Save",
          cancel: "Cancel",
          next: "Next",
          confirm: "Confirm",
          confirmation : "Confirmation",
          edit: "Edit",
          previous: "Previous",
          no: "No",
          yes: "Yes",
          ok: "Ok",
          continue: "Continue",
          entity: "entity{index}"

        },
        message: {
          cancel: "All changes made will be lost. Do you want to continue?",
          confirmSubmission: "The entity has been saved successfully. Please continue with next Entity.",
          restartSystem: "System configurations have been saved successfully for selected entities, please re-start the application for the changes to take effect."
        },

        dynamicModule: "Dynamic Module",
        summaryText: "To check whether multi entity configuration is completed by admin or not",
        entityName: "Entity : {entity}",
        gridLable: "Mandatory Day 1 properties"

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
  return new SystemConfigurationMenuLocale();
});
