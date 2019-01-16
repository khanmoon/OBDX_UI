define([], function() {
  "use strict";
  var cardPayLocale = function() {
    return {
      root: {
        pay: {
          cardHeading: "Card Payment",
          payAmtType: "Select Amount to Pay",
          specify: "Specify",
          amount: "Amount",
          sourceAccount: "Source Account",
          balance: "Balance",
          pay: "Pay",
          review: "Review",
          verification: "Verification",
          "verification-msg": "A verification code has been sent to your registered mobile number.\nPlease enter that code below to complete the process",
          verificationcode: "Verification code",
          resendcode: "Resend code",
          "resendcode-msg": "Didn't get the code?",
          "invalid-code": "Wrong verification code. Try again",
          resendotp: "Resend OTP",
          "otp-message": "Didn't get the code?",
          transactionMessage: "You have successfully completed your payment",
          refNo: "Transaction reference number {refNo}",
          pleaseSelect: "Please Select",
          continue: "Continue",
          reason2: "Please Select Reason",
          cancel: "Cancel",
          minimumAmt: "Minimum Amount",
          outstanding: "Outstanding",
          deliveryLocation: "Delivery Location",
          confirm: "Confirm",
          done: "Done",
          back: "Back",
          submit: "Submit",
          success: "Successful!",
          payConfirm: "Card Pay",
          reviewHeading: "You initiated a request for Credit Card bill pay. Please review details before you confirm!",
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
  return new cardPayLocale();
});
