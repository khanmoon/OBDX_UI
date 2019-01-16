define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          origination: {
            label: {

            }
          },
          info: "Info",
          altFwd: "Forward",
          titleFwd: "Forward",
          infodescription: "Please share your personal information.",
          salutation: "Salutation",
          firstName: "First Name",
          lastName: "Last Name",
          gender: "Gender",
          dateOfBirth: "Date of Birth",
          verificationcodemsg: "Please enter your verification code",
          email: "Email",
          verificationcodeemailmsg: "Check your Email Id for verification code",
          codeResendMsg: "OTP sent again",

          password: "Password",
          confirmPassword: "Confirm Password",
          pwdNoMatch: "Password and confirm password does not match"
        },
        messages: {
          msg1: "Please enter a password of {pwdMinLength} to {pwdMaxLength} characters in length.",
          msg2: "The password should contain at least {nbrNumeric} number(s), {nbrUpperAlpha} uppercase letter(s), {nbrLowerAlpha} lowercase letter(s) and {nbrSpecial} special character(s).",
          msg3: "The special characters allowed in the password are [{specialAllowed}].",
          passwordmismatch: "Password doesn't matches"

        },
        common: {
          submit: "Submit",
          continue: "Continue",
          cancel: "Cancel"
        },
        resendMsg: "OTP can be send for maximum 3 times only"
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
  return new TransactionLocale();
});