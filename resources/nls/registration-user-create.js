define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var RegistrationLocale = function() {
    return {
      root: {
        registration: {
          headerName: "Registration",
          buttons: {
            cancelButton: "Cancel",
            finishButton: "Sign Up"
          },
          logIn: {
            nameLabel: "User Name",
            passwordLabel: "Password",
            reEnterPasswordLabel: "Re Enter Password",
            login: "Login"
          },
          messages: {
            usernamePlaceholder: "Please enter user name",
            logInDetails: "Create your log in details",
            finishMessage: "Successful!",
            confirmationMessage1: "Please click on the Login to start banking - anywhere, anytime!",
            agreementCheck: "Please accept the Terms and Conditions",
            terms: "I agree to Terms and Conditions",
            termsAndConditionsPopUp: "Rook Bank Terms and Conditions",
             userRegistrationSuccessMessage : "Congratulations, you have successfully registered yourself!",
            userRegistrationConfirmationMessage : "Please click below to login."
          }
        },
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
  return new RegistrationLocale();
});
