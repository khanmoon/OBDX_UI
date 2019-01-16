define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var cancelCardLocale = function() {
    return {
      root: {
        cancelCard: {
          cardHeading: "Cancel Card",
          cancelHeadText1: "We are sad to see you go!",
          cancelHeadText2: "Help us by providing a reason for cancellation",
          RLC: "Permanent Relocation",
          SRC: "Unhappy with services",
          CHG: "Too many charges",
          OTH: "Other",
          reason: "Reason",
          specifyReason: "Specify Reason",
          action: "Action",
          comment: "Comments",
          success: "Successful!",
          transactionMessage: "Your request to cancel card has been submitted.",
          referenceNumber: "Service request number {refNo}",
          pleaseSelect: "Please Select",
          continue: "Continue",
          reason2: "Please Select Reason",
          cardNo: "Card Number",
          reviewHeading: "You initiated a request for credit card cancellation. Please review details before you confirm!"
        },
        genericCard: Generic.common
      }
    };
  };
  return new cancelCardLocale();
});