define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewChequeStopUnblock = function() {
    return {
      root: {
        common: {
          review: "Review",
          reviewHeader: "You initiated a request for Stop/unblock Cheque/s. Please review details before you confirm!",
          reason: "Specify Reason",
          from: "From",
          to: "To"
        },
        chequeBookRequest: {
          chequeBookType: "Type of Cheque Book",
          NumberOfCheques: "Number of Cheque Books",
          NumberOfLeaves: "Number of Leaves per Book",
          DeliveryLocation: "Delivery Location"
        },
        stopUnblockCheque: {
          actionToBePerformed: "Select Action",
          actionOnly: "Action",
          action: "Select Action",
          reviewHeading: "Review",
          accountNumber: "Account Number"
        },
        chequeDetails: {
          chequeDetails: "Give Cheque Details",
          number: "Number",
          range: "Range",
          chequeNumber: "Cheque Number"
        },
        confirmationMsg: {
          FINAL_LEVEL_APPROVED: "You have successfully approved the request.",
          MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval.",
          REJECT_BY_HOST: "Your request has been rejected.",
          REJECT: "You have rejected the request.",
          INITIATED: "Your request has been initiated successfully.",
          AUTO_AUTH: "Your request has been accepted."
        },
        header: "Stop/Unblock Cheque",
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
  return new ReviewChequeStopUnblock();
});
