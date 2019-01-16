define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        epi: {
          pay: "Pay",
          cancel: "Cancel",
          selectaccount: "Select Account",
          amount: "Amount",
          account: "Account",
          done: "Done",
          success: "Successful!",
          successmsg: "A payment of {amount} has been made.",
          epiHeader: "Complete Payment",
          epiVerificationHeader: "Verification",
          error: "Wrong Attempt",
          review: "Review",
          externalReferenceId: "Reference Id",
          successMessage: "Transaction was successful !!",
          failureMessage: "Transaction was failed !!",
          extrefidis: "External reference number is {number}",
          initiateHeader: "You initiated a payment for {merchant}.",
          reviewHeader: "You initiated a payment for {merchant}. Please review details before you confirm!",
          verification: {
            success: "Successful",
            failure: "Fail"
          },
          OPTverification: {
            verification: "Verification",
            message: "A verification code has been sent to your registered mobile number. Please enter that code below to complete the process",
            verificationcode: "Verification Code",
            resendcode: "Resend Code",
            resendcode_msg: "Did not get the code?",
            invalidOTP: "Invalid OTP"
          }
        },
        common: {
          cancel: "Cancel",
          submit: "Submit",
          verify: "Verify",
          confirm: "Confirm"
        },
        messages: Messages,
        generic: Generic
      }
    };
  };
  return new TransactionLocale();
});