define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var HOTPScreenLocale = function() {
    return {
      root: {
        verification: "Verification",
        verificationcode: "Verification Code",
        softTokenVerification: "Soft Token Verification",
        softTokenMessage: "Please Enter the code appearing on your soft token application",
        instructions: "Open Soft Token App on your handheld device and login with your PIN. ,Enter the Authorization Code displayed on the Soft Token App and generate OTP. ,Enter the OTP in the textbox below.",
        numberMsg: "Enter only numbers",
        referenceNo: "Reference Number",
        authorizationCode: "Authorization Code",
        correctOTPMsg: "Enter Correct OTP",
        allowedAttempts: "Attempts Left",
        generic: Generic
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new HOTPScreenLocale();
});