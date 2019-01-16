define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var applicationRepaymentInputLocale = function() {
    return {
      root: {
        bankAccount: "Bank Account",
        linkAccount: "Link your bank account for repayment and application fees",
        own: "Own",
        external: "External",
        linked: "Linked",
        accountName: "Account Name",
        accountNumber: "Account Number",
        institutionCodeType: "Institution Code Type",
        institutionCode: "Bank Code",
        linkedAccounts: "Linked Accounts",
        accountDetails: "Account Details",
        continue: "Continue",
        messages: {
          accountType: "Please select an account type",
          accountNumber: "Please enter an  account number",
          institutionCodeType: "Please enter a valid institution code type",
          specify: "Please enter a value"
        },
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
  return new applicationRepaymentInputLocale();
});