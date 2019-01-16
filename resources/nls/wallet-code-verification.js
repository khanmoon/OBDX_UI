define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          signupmsg: "Your Wallet is just a few clicks away.",
          verificationcodemsg: "Please enter your verification code",
          codeResendMsg: "OTP sent again",
          resendMsg: "OTP can be send for maximum 3 times only"

        },
        messages: {
          walletOrigination: {

          }
        },
        common: {
          continue: "Continue"

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