define([
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/obdx-locale"
], function(Generic, OBDXLocale) {
  "use strict";
  var RegistrationLocale = function() {
    return {
      root: {
        registration: {
          headerName: "Registration",
          pagetitle: {
            getOnline: "Get Online!!",
            forgotPassword: "Forgot Password"
          },
          buttons: {
            continueButton: "Continue",
            cancelButton: "Cancel"
          },
          creditCardDetails: {
            cardNoLabel: "Credit Card Number",
            nameLabel: "Name as on Card",
            expiryDateLabel: "Credit Card Expiry Date",
            cvvLabel: "CVV Number",
            emailLabel: "Email Id",
            dobLabel: "Date of Birth"
          },
          accountDetails: {
            customerIdLabel: "Customer ID",
            acctNoLabel: "Account Number",
            firstNameLabel: "First Name",
            lastNameLabel: "Last Name",
            emailLabel: "Email ID",
            dobLabel: "Date of Birth",
            debitCardNoLabel: "Debit Card Number",
            debitCardPinLabel: "Debit Card Pin"
          },
          messages: {
            usernamePlaceholder: "Please enter your email ID",
            haveAcct: "Have an account with Rook Bank?",
            accountDetail: "Great! Give us some details about your account, so we can look you up.",
            accountType: "Account Type",
            debitcardPlaceholder: "8888\xA0 8989\xA0 8989\xA0 9898 989",
            creditcardPlaceholder: "8888\xA0 8989\xA0 8989\xA0 9898"
          },
          verification: {
            verificationLabel: "Verification Code"
          }
        },
        generic: Generic,
        locale: OBDXLocale
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
  return new RegistrationLocale();
});
