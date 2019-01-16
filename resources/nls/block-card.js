define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var blockCardLocale = function() {
    return {
      root: {
        common: {
          DeliveryLocation: "Delivery Location"
        },
        blockCard: {
          cardHeading: "Block Card",
          cardNo: "Card Number",
          block: "Block",
          blockMsg: "Help us by providing few details",
          addressMsg: "Would you like to order a replacement card?",
          addressDetails: "{details},",
          O: "Other",
          L: "Lost",
          S: "Stolen",
          F: "Fraud Suspected",
          D: "Damaged",
          COWN: "Captured in own ATM",
          COTH: "Captured in other ATM",
          verifyMessage: "You are blocking this",
          questionMark: "?",
          replacementQuery: "Where would you like to receive the replacement card ?",
          referenceNumber: "Service request number is {refNo}",
          reason: "Reason",
          specifyReason: "Specify Reason",
          pleaseSelect: "Please Select",
          continue: "Continue",
          reason2: "Please Select Reason",
          action: "Action",
          back: "Back",
          replace: "{action} and Replace",
          review: "Review",
          reviewHeading: "You initiated a request for block credit card. Please review details before you confirm!",
          reviewReplaceHeading: "You initiated a request for block and replace credit card. Please review details before you confirm!",
          selectedCard: "Select Card",
          srMessage: "{txn} service Request Number",
          blockMessage: "Card blocked successfully",
          replacementCard: "Replacement Card",
          status: "Status"

        },
        creditCardType: {
          GOLD: "Gold Credit Card",
          PLATINUM: "Platinum Credit Card",
          amt_due_on: "Amount due on",
          addon: "add-on"
        },
        cardLinks: {
          viewStatement: "View Statement",
          cardPayment: "Card Payment",
          requestPin: "Request PIN",
          blockCard: "Block/Cancel Card",
          autoPay: "Auto Pay",
          resetPin: "Reset PIN",
          addOnCard: "Add-On Card"
        },
        genericCard: Generic.common
      }
    };
  };
  return new blockCardLocale();
});
