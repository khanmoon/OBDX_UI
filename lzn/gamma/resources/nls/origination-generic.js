define([], function() {
  "use strict";
  var originationLocale = function() {
    return {
      root: {
        pageTitle: {
          product: "Product",
          landing: "Model Bank - Welcome",
          tracking: "My Applications"
        },
        override: {
          localCurrency: "usd",
          citizenship: "us"
        },
        productFooter: {
          line1: "Our site and your online applications are secure. Copyright Model Bank Ltd."
        },
        common: {
          cancel: "Cancel",
          submit: "Submit",
          search: "Search",
          ok: "ok",
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
          dollarAscii: "36",
          percentageAscii: "37",
          "apply": "Apply",
          "cancelApp": "Cancel Application",
          "login": "Login",
          "amount": "Amount",
          "tenure": "Tenure",
          "skip": "Skip",
          "verify": "Verify",
          "add": "Add",
          "pleaseSelect": "Please Select",
          "error": "Error",
          "warning": "Warning",
          "info": "Info",
          "accept": "Accept",
          "proceed": "Proceed",
          "saveLater": "Save for Later",
          "revSubmit": "Review & Submit",
          "saveApplication": "Save Application",
          "submitApplication": "Submit Application",
          "register": "Register",
          "yes": "Yes",
          "no": "No",
          "modify": "Modify",
          "exit": "Are you sure you want to cancel your application?",
          returnApplication: "Return to Application",
          trackApplication: "Track your Application",
          homepage: "Go to Homepage",
          months: {
            "January": "January",
            "February": "February",
            "March": "March",
            "April": "April",
            "May": "May",
            "June": "June",
            "July": "July",
            "August": "August",
            "September": "September",
            "October": "October",
            "November": "November",
            "December": "December"
          }
        }
      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new originationLocale();
});
