define([], function() {
  "use strict";
  var addonCardLocale = function() {
    return {
      root: {
        common: {
          DeliveryLocation: "Delivery Location"
        },
        addonCard: {
          cardHeading: "Apply for Add-On Card",
          cardfor: "Relationship",
          cardforSelect: "Please select the value",
          nameOnCard: "Name on Card",
          reqCreditLimit: "Required Credit Limit",
          reqCashLimit: "Required Cash Limit",
          success: "Successful!",
          transactionMessage: "Your new add on card request has been submitted.",
          referenceNumber: "Service request number {refNo}",
          pleaseSelect: "Please Select",
          cannotExceed: "(Cannot exceed {currency})",
          deliveryLocation: "Delivery Location",
          apply: "Apply",
          cancel: "Cancel",
          confirm: "Confirm",
          done: "Done",
          newCreditLimit: "New Credit Limit",
          newCashLimit: "New Cash Limit",
          review: "Review",
          addOnConfirm: "Add-on card",
          back: "Back",
          FATHER: "Father",
          MOTHER: "Mother",
          SON: "Son",
          DAUGHTER: "Daughter",
          SPOUSE: "Spouse",
          reviewHeading: "You initiated a request for add on card. Please review details before you confirm!",
          selectedCard: "Select Card",
          cardNumber: "Card Number"
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
  return new addonCardLocale();
});