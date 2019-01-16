define([], function() {
  "use strict";
  var requestPinLocale = function() {
    return {
      root: {
        common: {
          DeliveryLocation: "Delivery Location"
        },
        requestPin: {
          cardHeading: "Request PIN",
          referenceNumber: "Service request number is {refNo}",
          cancel: "Cancel",
          done: "Done",
          confirm: "Confirm",
          review: "Review",
          submit: "Submit",
          back: "Back",
          addressDetails: "{details},",
          transactionName: "Request Pin",
          reviewHeading: "You initiated a request for pin request. Please review details before you confirm!",
          selectedCard: "Select Card",
          cardNumber: "Card Number",
          reviewHeader: "You initiated a Credit Card PIN request. Please review details before you confirm!"
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
  return new requestPinLocale();
});
