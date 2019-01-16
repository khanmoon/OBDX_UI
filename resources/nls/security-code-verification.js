define([

], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          peertopeer: {
            enterTransferValue: "Email/Mobile Number",
            enterSecurityCode: "Security Code",
            existing: "Existing Customer",
            newUser: "New to Bank",
            selectmode: "Select Mode",
            EMAIL: "Email",
            MOBILE: "Mobile Number",
            mobileno: "Mobile",
            facebook: "Facebook",
            claimPaymentHeader: "Claim Money"
          }
        },
        common: {
          back: "Back"
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