define([], function() {
  "use strict";
  var CustomerPreferenceLocale = function() {
    return {
      root: {
        INITIATED: "Initiated",
        ACCEPTED: "Pending Approval",
        REJECTED: "Rejected",
        apply: "Apply",
        cancel: "Cancel",
        ok: "Ok",
        error: "Error",
        create: "Create",
        done: "Done",
        submit: "Submit",
        continue: "Continue",
        login: "Login",
        confirm: "Confirm",
        edit: "Edit",
        amount: "Amount",
        tenure: "Tenure",
        save: "Save",
        delete: "Delete",
        modify: "Modify",
        enable: "Enable",
        disable: "Disable",
        search: "Search",
        reset: "Reset",
        add: "Add",
        remove: "Remove",
        demobank: "ZigBank",
        signout: "Sign Out",
        assign: "Assign",
        select: "Select All",
        fetchdetails: "Fetch Details",
        yes: "Yes",
        no: "No",
        view: "View",
        createNew: "Create",
        review: "Review",
        transactionMessage: "Maintenance saved successfully.",
        confirmation: "Confirmation",
        back: "Back",
        confirmationMessage: "Are you sure you want to cancel this transaction ?",
        successful: "Successful!"
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
  return new CustomerPreferenceLocale();
});