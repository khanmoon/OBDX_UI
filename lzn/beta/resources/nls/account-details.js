define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var accountDetailsLocale = function() {
    return {
      root: {
        needAccountDetails: "We need your checking account details",
        routingNumber: "Routing Number",
        accountNumber: "Account Number",
        reenterAccountNumber: "Re-enter Account Number",
        bankName: "Bank Name",
        accountType: "Account Type",
        checking: "Checking",
        savings: "Savings",
        findDetails: "Where Do I Find These Details?",
        accountDetailsClick: "Where Do I Find These Details?",
        accountDetailsClickTitle: "Where Do I Find These Details? popup",
        yourAccountInformation: "Your Account Information",
        yourAccountInformationText: "Your account information will be available in the checkbook provided to you by your bank.<br>Your routing number and account number appear on every check leaf like this",
        messages: {
          routingNumber: "Please enter a valid routing number",
          accountNumber: "Please enter a valid account number",
          reenterAccountNumber: "Please re-enter your account number",
          accountNumberMatch: "Account numbers do not match. Please try again.",
          bankName: "Please enter a valid bank name"
        },
        generic: Generic

      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new accountDetailsLocale();
});