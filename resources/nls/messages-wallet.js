define([], function() {
  "use strict";
  var MessagesWalletLocale = function() {
    return {
      root: {
        walletsetup: {
          totalwalletlimit: "Wallet Total limit cannot be blank",
          debitallowed: "Wallet Debit limit cannot be blank",
          creditallowed: "Wallet Credit limit cannot be blank"
        },
        charactersLeft: "Characters left",
        walletOrigination: {
          email: "Please enter a valid Email",
          firstName: "Please enter a valid First Name",
          lastName: "Please enter a valid Last Name",
          salutation: "Please select a Salutation",
          gender: "Please select Gender",
          mobileNumber: "Please provide valid mobile number",
          securityQuestion: "Please select a Security question",
          securityAnswer: "Invalid characters entered.Security answer cannot be blank.",
          password: "Invalid characters entered",
          passwordBlank: "Password cannot be blank",
          confirmPassword: "Password and Confirm password does not match. Please enter same password.",
          termsAndConditions: "Please confirm the Terms & Conditions",
          birthDate: "Please enter Date of Birth",
          verificationCode: "Please provide valid verification code",
          wrongVerificationCode: "Verification code does not match. Please enter a valid verification code",
          exceededAttempts: "You have exceeded maximum number of attempts. Request you to contact the bank."
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
  return new MessagesWalletLocale();
});