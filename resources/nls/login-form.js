define([], function() {
  "use strict";
  var loginFormLocale = function() {
    return {
      root: {
        loginForm: {
          labels: {
            login: "Login",
            password: "Password",
            forgotPassword: "Forgot Password",
            forgotUserId: "Forgot User Id",
            forgotUsername: "Forgot Username",
            cancel: "Cancel",
            ok: "Ok",
            verticalSeperation: "|",
            submit: "Submit",
            username: "Username",
            pin: "Pin",
            pattern: "Pattern",
            touchid: "Finger Print",
            faceid: "Face ID",
            pwd: "Password",
            sinceYouAreNewUser: "Since you are a new user please complete the first time login steps using your login credentials.",
            enableAlternateLogin: "Enable Alternate Login",
            fp_changed: "Fingerprint Settings Changed. Please Setup fingerprint again",
            fp_error: "Fingerprint Authentication Failed. Please Try Again",
            fp_cancelled: "Fingerprint Authentication Dialog Cancelled!",
            fp_token_failed: "Token validation failed. Please login again with username and password.",
            maximum_retry_exceeded: "Maximum Attempts Exceeded. Please Setup Fingerprint Again",
            token_unauthorized_error: "Quick login failed. Please login with username and password.",
            token_failed_error: "Login failed. Please login after sometime.",
            login_error: "Login failed. Please login after sometime.",
            fp_token_invalid: "User Authentication for quick login failed. Please login again with username and password.",
            push_window_message: "Zig Bank would like to send notifications. These may include alerts, offers, sounds, badges and images. Would you like to allow the same.",
            fingerPrintAuthMessage: "Place your finger",
            allow: "Allow",
            disallow: "Disallow",
            push_window_title: "Allow Notifications",
            quicksnapshot: "Quick Snapshot",
            verify_message: "Place Your Finger",
            loginVia: "Login with {type}"
          },
          validationMsgs: {
            invalidCredentials: "Invalid Username and/or Password",
            systemError: "System Cannot Process the Request. Please Try Again",
            errrorOAM10: "Your password has expired. Please use Oracle Directory Services Manager to reset the same",
            errrorOAM5: "Your account is locked. Please contact branch/customer care center to unlock the same"
          }
        },
        errors: {
          NO_CONNECTIVITY: "Please Check your Internet Connection",
          DEVICE_NOT_COMPLIANT: "Your Device is Not Compliant",
          SSL_PINNING_FAILED: "Untrusted Server. Contact Bank",
          INTERNAL_SERVER_ERROR: "Internal Server Error",
          MULTIPLE_WATCHES_CONNECTED: "You have connected multiple watches. Please connect only one and continue.",
          WATCH_NOT_CONNECTED: "You have not connected any watches. Please connect one and continue.",
          APP_NOT_FOUND: "Application not found in the watch connected."
        },
        forgotPasswordClick: "Click For Forgot Password",
        forgotPasswordTitle: "Click Here To Reset Your Password",
        forgotUserIdClick: "Click For Forgot User Id",
        forgotUserIdTitle: "Click Here To Reset Your User Id"
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
  return new loginFormLocale();
});
