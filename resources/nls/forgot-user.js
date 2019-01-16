define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var ForgotUserIdLocale = function() {
    return {
      root: {
        forgotUserId: {
          buttons: {
            continueButton: "Continue",
            resendButton: "Resend Code",
            cancelButton: "Cancel",
            logInButton: "Login",
            submitButton: "Submit",
            resetButton: "Submit",
            ok: "Ok"
          },
          messages: {
            clickHere: "Login to Zigbank account.",
            usernameEmail: "Username sent successfully on your email address / mobile number.",
            enterDetails: "Enter the registered email address in your Zigbank account",
            usernamePlaceholder: "Please enter your email ID"
            },
          details: {
            nameLabel: "Email",
            forgotUserName: "Don't remember your username ?",
            codeNotReceived: "Didn't get the code",
            dobLabel: "Date of Birth"
          },
          header: {
            forgotUserName: "Forgot Username",
            signUpLabel: "Sign Up"
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
  return new ForgotUserIdLocale();
});