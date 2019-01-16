define([], function() {
  "use strict";
  var autoPayLocale = function() {
    return {
      root: {
        autopay: {
          cardHeading: "Auto Pay",
          regMsgLine1: "You currently are not registered for Auto Pay.",
          regMsgLine2: "Would you like to register?",
          payAmtTypeSelect: "Select Amount for Auto Pay",
          payAmtType: "Amount for Autopay",
          sourceAccount: "Account Number",
          MAD: "Minimum Due",
          TAD: "Total Due",
          deregister: "Deregister",
          yes: "Yes",
          no: "No",
          cancel: "Cancel",
          confirm: "Confirm",
          srRefNo: "Service request number {refNo}",
          review: "Review",
          update: "Update",
          createAuto: "Create Auto Pay",
          updateAuto: "Update Auto Pay",
          delete: "Delete Auto Pay",
          back: "Back",
          reviewHeader: "Review",
          reviewHeading: "You have initiated a request for auto payment. Please review details before you confirm!",
          reviewHeading2: "You have initiated a request to deregister auto payment. Please review details before you confirm!",
          selectedCard: "Select Card",
          cardNumber: "Card Number",
          inactiveCard: "This facility is not available on this card."
        },
        cardLinks: {
          viewStatement: "View Statement",
          cardPayment: "Card Payment",
          requestPin: "Request PIN",
          blockCard: "Block/Cancel Card",
          autoPay: "Auto Pay",
          resetPin: "Reset PIN",
          addOnCard: "Add-On Card"
        }
      }
    };
  };
  return new autoPayLocale();
});
