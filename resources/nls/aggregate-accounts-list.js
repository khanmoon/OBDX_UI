define(["ojL10n!resources/nls/generic"], function(Generic, initiateLC) {
  "use strict";
  var AggreateAccountLocale = function() {
    return {
      root: {
        generic : Generic,
        initiateLC : initiateLC,
        heading: {
          sites: "Most Popular Sites"
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
          cancel:"Cancel",
          linkButton : "Link",
          deLinkButton : "Delink",
          backToDashboard: "Back To Dashboard",
          delinkAccount: "Delink Account",
          confirmMessage: "Do you want to delink the account?",
          confirmButton: "Confirm",
          cancelButton: "Cancel"
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
          noBillerRegistered: "Currently you do not have any billers registered . Please go to Add Billers to register.",
          noBillersMapped: "Currently no billers are available under the selected category",
          paymentSupported: "Note: This biller accepts payment via {paymentTypes} accounts.",
          deleteBiller: "Are you sure you want to delete this biller?",
          addSuccessMessage: "Biller added successfully.",
          deleteSuccessMessage: "Biller deleted successfully.",
          updateSuccessMessage: "Biller updated successfully.",
          pendingApproval: "Pending Approval",
          sucessfull: "Successfull",
          corpMaker: "You have successfully initiated the transaction.",
          cancelOperation: "Are you sure you want to cancel the operation?",
          reviewMsg: "You initiated a request for add biller. Please review details before you confirm!",
          reviewUpdateMsg: "You initiated a request for update biller. Please review details before you confirm!",
          reviewPaymentMsg: "You initiated a request for bill payment. Please review details before you confirm!",
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
