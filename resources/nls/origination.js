define([], function() {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        pageTitle: {
          product: "Product",
          landing: "ZigBank - Welcome",
          tracking: "My Applications"
        },
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
          accept: "Accept",
          proceed: "Proceed",
          saveLater: "Save for Later",
          revSubmit: "Review & Submit",
          saveApplication: "Save Application",
          submitApplication: "Submit Application",
          register: "Register",
          yes: "Yes",
          no: "No",
          exit: "Are you sure you want to cancel your application?",
          returnApplication: "Return to Application",
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
  return new OriginationLocale();
});