define([], function() {
  "use strict";
  var limitsLocale = function() {
    return {
      root: {
        cardLimit: {
          cardHeading: "Update Card Limit",
          currentCreditLimit: "Current Credit Limit",
          newCreditLimit: "New Credit Limit",
          currentCashLimit: "Current Cash Limit",
          newCashLimit: "New Cash Limit",
          cannotExceed: "Cannot exceed",
          review: "Review",
          success: "Successful!",
          transactionMessage: "Your request to update card limit has been submitted.",
          transactionMessageCA: "Your cash limit has been updated.",
          transactionMessageCR: "Your credit limit has been updated.",
          referenceNumber: "Service request number {refNo}",
          update: "Update",
          cancel: "Cancel",
          done: "Done",
          confirm: "Confirm",
          confirmUpdateLimit: "Transaction"
        }
      }
    };
  };
  return new limitsLocale();
});