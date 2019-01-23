define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var ForgotPasswordLocale = function() {
    return {
      root: {
        forgotPassword: {
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
            enterDetails: "Okay, no problem. Just enter the details below.",
            usernamePlaceholder: "Please enter your email ID",
            enterOtp: "A verification code has been sent to your registered mobile number.  Please enter that code below to complete the process",
            successMessage: "Successful!",
            passwordChangeSuccess: "Password changed successfully!",
            login: "Please click below to login.",
            confirmationMessage: "Your password has been reset",
            password: "Enter at least 8 characters including a number, one uppercase and lowercase letter.",
            verification: "Verification",
            enterPassword: "Please enter your new password",
            otpValidation: "Invalid OTP",
            passwordMatch: "The Password must match!"
          },
          verification: {
            verificationLabel: "Verification Code"
          },
          details: {
            nameLabel: "Username",
            passwordLabel: "Password",
            forgotUserName: "Don't remember your username ?",
            forgotPassword: "Forgot Password",
            codeNotReceived: "Didn't get the code",
            dobLabel: "Date of Birth",
            newPasswordLabel: "New Password",
            reEnterPasswordLabel: "Re-enter Password",
            resetPassword : "Reset Password"
          },
          header: {
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
  return new ForgotPasswordLocale();
});
