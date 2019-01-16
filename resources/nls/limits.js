define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var limitsLocale = function() {
    return {
      root: {
        cardLimit: {
          cardHeading: "Update Card Limit",
          currentCreditLimit: "Current Credit Limit",
          newCreditLimit: "New Credit Limit",
          cardLimits: "Limits",
          limitsType: "Limit Type",
          available: "Available",
          total: "Total",
          availableCredit: "Available Credit",
          totalCredit: "Total Credit",
          availableCash: "Available Cash",
          totalCash: "Total Cash",
          currentCashLimit: "Current Cash Limit",
          newCashLimit: "New Cash Limit",
          cannotExceed: "Cannot exceed",
          review: "Review",
          success: "Successful!",
          transactionMessage: "Your request to update card limit has been submitted.",
          transactionMessageCA: "Your cash limit has been updated.",
          transactionMessageCR: "Your credit limit has been updated.",
          referenceNumber: "Service request number {refNo}",
          update: "Update Limits",
          back: "Back",
          save: "Save",
          cancel: "Cancel",
          done: "Done",
          confirm: "Confirm",
          limitsTable: "Limits Table",
          editDailyLimits: "Edit Daily Limits",
          transactionName: "Limits Update"
        },
        generic: Generic.common
      }
    };
  };
  return new limitsLocale();
});