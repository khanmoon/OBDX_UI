define([], function() {
  "use strict";
  var originationLocale = function() {
    return {
      root: {
        common: {
          cancel: "Cancel",
          submit: "Submit",
          search: "Search",
          ok: "Ok",
          select: "Select",
          reset: "Reset",
          confirm: "Confirm",
          done: "Done",
          edit: "Edit",
          create: "Create",
          save: "Save",
          name: "{firstName} {lastName}",
          userName: "{firstName} {lastName} ({userName})",
          clear: "Clear",
          continue: "Continue",
          apply: "Apply",
          cancelApp: "Cancel Application",
          login: "Login",
          amount: "Amount",
          tenure: "Tenure",
          skip: "Skip",
          verify: "Verify",
          add: "Add",
          pleaseSelect: "Please Select",
          error: "Error",
          warning: "Warning",
          info: "Info",
          accept: "Accept",
          proceed: "Proceed",
          saveLater: "Save for Later",
          revSubmit: "Review & Submit",
          saveApplication: "Save Application",
          register: "Register",
          yes: "Yes",
          no: "No",
          modify: "Modify",
          exit: "Are you sure you want to cancel your application?",
          returnApplication: "Return to Application",
          submitApplication: "Submit Application",
          trackApplication: "Track your Application",
          homepage: "Go to Homepage"
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
  return new originationLocale();
});