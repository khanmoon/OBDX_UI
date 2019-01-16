define([], function() {
  "use strict";
  var activateCardLocale = function() {
    return {
      root: {
        activateCard: {
          cardHeading: "Activate Card",
          activateHeadText: "We are pleased to see you !",
          reason: "Reason",
          comment: "Comment",
          activate: "Activate",
          N: "New",
          D: "Deactive",
          success: "Successful!",
          transactionMessage: "Your request to activate card has been submitted.",
          referenceNumber: "Service request number {refNo}",
          pleaseSelect: "Please Select",
          reasonSelect: "Please Select Reason",
          confirm: "Confirm",
          done: "Done",
          cancel: "Cancel",
          review: "Review",
          activateConfirm: "Transaction"
        }
      }
    };
  };
  return new activateCardLocale();
});