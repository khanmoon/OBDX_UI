define([], function() {
  "use strict";
  var LocationSearchLocale = function() {
    return {
      root: {

        pageTitle: {
          header: "System Configuration"
        },
        buttons: {
          cancel: "Cancel",
          edit: "Edit",
          add: "Add",
          next: "Next",
          save: "Save",
          confirm: "Confirm",
          yes: "Yes",
          no: "No",
          ok: "Ok",
          previous: "Previous"
        },
        message: {
          cancel: "All changes made will be lost. Do you want to continue?",
          restartSystem: "Please restart the server to reflect your changes."
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationSearchLocale();
});