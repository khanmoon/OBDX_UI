define([], function() {
  "use strict";
  var otpVerificationLocale = function() {
    return {
      root: {
        verification: "Verification",
        message: {
          otpDevice1: "A verification code has been sent to your registered mobile number and email address. Please enter that code below to complete the process",
          otpDevice2: "A verification code has been sent to your registered email address. Please enter that code below to complete the process",
          otpDevice3: "A verification code has been sent to your registered mobile number. Please enter that code below to complete the process",
          otpDevice4: "A verification code has been sent to your specified email address. Please enter that code below to complete the process",
          otpDevice5: "A verification code has been sent to your email/mobile. Please enter that code below to complete the process"
        },
        verificationcode: "Verification Code",
        resendcode: "Resend Code",
        resendcode_msg: "Did not get the code?",
        cancel: "Cancel",
        submit: "Submit",
        togglePassword: "Click to toggle password",
        togglePasswordAlt: "Toggle Password"
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
  return new otpVerificationLocale();
});