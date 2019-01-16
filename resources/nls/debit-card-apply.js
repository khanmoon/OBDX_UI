define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ChequeBookRequest = function() {
    return {
      root: {
        compName: {
          newDebitCard: "New Debit Card",
          embossedName: "Name on Card"
        },
        chequeBookRequest: {
          debitCardApply: "Debit Card Apply"
        },
        common: {
          DeliveryLocation: "Delivery Location",
          successful: "Successful!",
          reason: "Specify Reason",
          select: "Please Select",
          submit: "Submit",
          cancel: "Cancel",
          confirm: "Confirm",
          done: "Done",
          backToDashboard: "Back to Dashboard",
          accountNumber: "Account Number",
          reviewHeading: "You initiated a request for New Debit Card. Please review details before you confirm!"
        },
        apply: {
          transactionName: "New Debit Card",
          applyDebitConfirm: "Your new debit card will be delivered at the desired location!",
          serviceRequestNumber: "Service Request Number is {refNo}"
        },
        review: {
          reviewHeading: "Review"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ChequeBookRequest();
});