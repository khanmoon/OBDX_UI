define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          signup: "Sign Up",
          newtobank: "New to Bank ?",
          receivecodemsg: "Please enter your mobile number to receive the verification code",
          mobilenumber: "Mobile Number",
          receivecodetext: "Receive Code"
        },
        messages: {
          walletOrigination: {
            mobileNumber: "Mobile Number"

          }
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
  return new TransactionLocale();
});