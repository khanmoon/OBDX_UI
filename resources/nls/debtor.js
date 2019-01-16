define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        debtors: {
          debtorName: "Debtor Name",
          debtorIban: "Debtor IBAN",
          managedebtor_header: "Manage Debtors",
          bankBICCode: "Bank BIC Code",
          verify: "Verify",
          lookUpBIC: "Lookup Bank BIC Code",
          lookUpBICTitle: "Click to lookup for Bank BIC Code",
          nickname: "Nickname",
          or: "Or",
          bankAccount: "Bank Account",
          review: "Review",
          bicCode: "BIC Code",
          otpMessage: "Didn't get the code?",
          otpMessageText: "Click to receive one time password",
          resendotp: "Resend OTP",
          requestMoney: "Request Money",
          debtorDeleteMessage1: "Are you sure you want to delete",
          debtorDeleteMessage2: "account?",
          deleteMessage: "-Debtor account is deleted.",
          sucessfull: "Successful!",
          confirmEditDebtor: "Edit Debtor",
          confirmDeleteDebtor: "Delete Debtor"
        },
        common: {
          submit: "Submit",
          pleaseSelect: "Please Select",
          save: "Save",
          add: "Add",
          confirm: "Confirm",
          delete: "Delete",
          cancel: "Cancel",
          edit: "Edit",
          done: "Done"
        },
        messages: Messages,
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
  return new TransactionLocale();
});