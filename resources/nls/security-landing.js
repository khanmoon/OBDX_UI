define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var setPin = function() {
    return {
      root: {
        verifyUser: "Verify User",
        enterPassword: "Enter Password",
        login_error: "Login failed. Please login after sometime.",
        invalidCredentials: "Invalid Password",
        pleaseAllow: "Allow ZigBank app to store your device ID?",
        allow: "Allow",
        deny: "Deny",
        errors: {
          fp_changed: "Fingerprint Settings Changed. Please Setup fingerprint again",
          fp_error: "Fingerprint Authentication Error:",
          fp_cancelled: "Fingerprint Authentication Dialog Cancelled!",
          fp_token_failed: "Token validation failed. Please login again with username and password.",
          token_unauthorized_error: "Quick login failed. Please login with username and password.",
          token_failed_error: "Login failed. Please login after sometime.",
          login_error: "Login failed. Please login after sometime.",
          fp_token_invalid: "User Authentication for quick login failed. Please login again with username and password."
        },
        proceed: "Proceed",
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
  return new setPin();
});
