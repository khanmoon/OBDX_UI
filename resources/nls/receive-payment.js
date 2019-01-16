define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          peertopeer: {
            existingUser: {
              email: "Registered Email",
              password: "Password"
            }
          }
        },
        common: {
          cancel: "Cancel",
          login: "Login",
          registration: "Registration"
        }
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
  return new TransactionLocale();
});