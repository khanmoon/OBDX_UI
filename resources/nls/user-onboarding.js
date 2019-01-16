define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          peertopeer: {
            registration: "Registration",
            globalpayee: {
              firstName: "First Name",
              lastName: "Last Name",
              mobileNumber: "Mobile Number",
              phoneNumber: "Phone Number",
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
              userCreatedMsg: "User Created Successfully. Please Login to Continue",
              review: "Review"
            }
          }
        },
        common: {
          select: "Select",
          back: "Back",
          bankname: "ZigBank",
          submit: "Submit",
          success: "Successful",
          edit: "Edit",
          update: "Update",
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
          login: "Login"
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