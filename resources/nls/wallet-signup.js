define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          header: "wallets",
          signuptitle: "Quick and Easy Payments!",
          signup: "Sign up",
          login: "Login",
          forgotpassword: "Forgot Password ?"
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