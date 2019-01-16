define([], function() {
  "use strict";
  var generatePinLocale = function() {
    return {
      root: {
        resetPin: {
          creditCardHeading: "Reset Credit Card PIN",
          debitCardHeading: "Reset Debit Card PIN",
          generatePinHeadText: "You have received an OTP on your mobile number",
          success: "Successful!",
          transactionMessage: "Your new PIN will be delivered at the desired location.",
          referenceNumber: "Service request number {refNo}",
          cancel: "Cancel",
          done: "Done",
          confirm: "Confirm",
          review: "Review",
          deliveryLocation: "Delivery Location",
          submit: "Submit",
          back: "Back",
          expiryDate: "Expiry Date on Card",
          cvvNumber: "CVV Number",
          cancelConfirm: "Are you sure you want to cancel the operation?",
          enterOTP: "Enter OTP",
          newPin: "Enter New PIN",
          reEnterNewPin: "Re-enter New PIN",
          enterDetails: "Enter Card Details",
          resetPin: "Reset Pin",
          validate: "Validate",
          monthFormat: "mm",
          yearFormat: "yy",
          enter: "Enter",
          mismatch: "Pins entered does not match",
          validMonth: "Please enter valid month",
          validYear: "Please enter valid  year",
          resetPinSuccessMsg: "Reset Pin",
          selectedCard: "Select Card",
          cardNumber: "Card Number",
          dateOfBirth: "Date of Birth",
          validDateOfBirth: "Please enter valid date of birth"
        },
        debitCards: {
          customerName: "Customer Name",
          cardType: "Card Type",
          accountNo: "Account Number",
          cardNumber: "Card Number",
          nameOnCard: "Name on Card",
          fullName: "{firstName} {middleName} {lastName}",
          validThru: "Valid Thru",
          status: "Status"
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
  return new generatePinLocale();
});
