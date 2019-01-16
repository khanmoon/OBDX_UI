define([
  "ojL10n!resources/nls/messages-claim-payment",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          peertopeer: {
            titleRetail: "Claim Payment",
            accountInformation: "Account Information",
            txnname: "Claim Money",
            globalpayee: {
              firstName: "First Name",
              lastName: "Last Name",
              email: "Email",
              aliasValue: "Alias Value",
              aliasType: "Alias Type",
              userName: "User Name",
              password: "Password",
              passwordMatch: "Password doesn\'t match",
              confirmPassword: "Confirm Password",
              otpmsg: "An OTP has been sent to you for confirming the recipient",
              resendotp: "Resend OTP",
              enterotp: "Enter OTP",
              accountNumber: "Account Number",
              accountName: "Account Name",
              branch: "Branch",
              payeeType: "Payee Type",
              accountWith: "Account with",
              thisBank: "This Bank",
              otherBank: "Other Bank",
              ifsc: "IFSC Code",
              lookupifsccode: "Lookup IFSC Code",
              transferTo: "Transfer To",
              accountInfo: "Account Information",
              confirmation: "Confirmation",
              invalidError: "Invalid IFSC code",
              userCreatedMsg: "User created successfully. Please Login to continue.",
              review: "Review"
            },
            claimPayment: {
              successmsg: "Successful!",
              successmsg2: "Funds Transferred to {account} successfully.",
              successmsg3: "Reference Number {referenceNumber}"
            }
          }
        },
        common: {
          select: "Select",
          back: "Back",
          submit: "Submit",
          success: "Successful",
          edit: "Edit",
          add: "Add",
          cancel: "Cancel",
          confirm: "Confirm",
          initiate: "Initiate",
          create: "Create",
          done: "Done",
          pleaseSelect: "Please Select",
          search: "Search",
          yes: "Yes",
          no: "No",
          reset: "Reset",
          save: "save",
          ok: "Ok",
          verify: "Verify",
          login: "Login",
          reviewHeaderMsg: "You initiated a request for {txnName}. Please review details before you confirm!"
        },
        messages: Messages,
        generic: Generic
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