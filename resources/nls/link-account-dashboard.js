define(["ojL10n!resources/nls/generic"], function(Generic, initiateLC) {
  "use strict";
  var AggreateAccountLocale = function() {
    return {
      root: {
        generic : Generic,
        initiateLC : initiateLC,
        heading: {
          dashboard: "Dashboard"
        },
        labels: {
          bankLogo: "Bank Logo",
          bankName: "Bank Name",
          oauth_enabled: "Authorization Enabled",
          noData: "No Data:",
          addExtBank: "Add External Accounts",
          registeraccount: "Register Account",
          unregisteraccount: "Unregister Account",
          regunregaccount: "Register/Unregister Account",
          regsuccessfully: "{bankName} registerd successfully",
          messagesucc: "Message",
          deleteSuccessMessage: "Bank has been Unregistered",
          completed: "Completed",
          linkAccount: "Link Account",
          cancel:"Cancel"
        },
        validationErrors: {
          invalidNickname: "Nickname can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          uniqueNickname: "{nickname} is already in use. Please give a different nickname.",
          invalidCustName: "Customer Name can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          invalidAmountErrorMessage: "Amount should be greater than 0",
          amountError: "Amount should be lesser than 1 trillion",
          invalidpartPaymentErrorMessage: "Modified  amount can not exceed the original bill amount",
          invalidexcessPaymentErrorMessage: " Modified  amount can not be less than the original bill amount",
          ALPHANUMERIC: "Please enter  the details in the alphanumric format",
          NUMERIC: "Please enter  the details in the numeric format",
          TEXT: "Please enter  the details in the text format",
          OTHERS: "Please enter valid data",
          invalidDateErrorMessage: "Scheduled payment date can not be beyond the due date of the bill"
        },
        messages: {
          pendingApproval: "Pending Approval",
          sucessfull: "Successfull",
          corpMaker: "You have successfully initiated the transaction.",
          cancelOperation: "Are you sure you want to cancel the operation?",
          paymentSuccessMessage: "Payment done successfully !"
        }

      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new AggreateAccountLocale();
});
