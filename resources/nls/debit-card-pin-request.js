define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ChequeBookRequest = function() {
    return {
      root: {
        review: "Review",
        reviewHeader: "You initiated a Debit Card PIN request. Please review details before you confirm!",
        compName: {
          debitCardPinRequest: "Debit Card Pin Request"
        },
        debitCards: {
          customerName: "Customer Name",
          cardType: "Card Type",
          accountNo: "Account Number",
          cardNumber: "Card Number",
          CardHolder: "Card Holder Name",
          expDate: "Expiry Date",
          nameOnCard: "Name on Card",
          fullName: "{firstName} {middleName} {lastName}",
          validThrough: "Valid Thru",
          status: "Status"
        },
        common: {
          DeliveryLocation: "Delivery Location",
          successful: "Successful!",
          submit: "Submit",
          cancel: "Cancel",
          confirm: "Confirm",
          done: "Done"
        },
        stopUnblockCheque: {
          actionToBePerformed: "Select Action",
          actionOnly: "Action",
          action: "Select Action",
          reviewHeading: "Review",
          selectAccount: "Select Account Number",
          transactionName: "Cheque Stop unblock"
        },
        pinRequest: {
          transactionName: "Debit Card Request Pin",
          requestPinConfirm: "Your new PIN will be delivered at the desired location!",
          serviceRequestNumber: "Service Request Number is {refNo}"
        },
        buttons: {
          debitCards: "Debit Cards",
          pinRequest: "Request Pin",
          limits: "View Limits",
          blockCards: "Block Card",
          yesD: "Yes, Disable",
          yesA: "Yes, Active",
          editDailyLimits: "Edit Daily Limits",
          resetPin: "Reset Pin",
          upgradeCard: "Upgrade Card",
          reissueCard: "Reissue Card",
          debitCardDetails: "Debit Card Details"
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
