define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var TermDepositTopUp = function() {
    return {
      root: {
        topUp: {
          topUp: "Top Up",
          sourceAccount: "Source Account",
          topUpAmount: "Top Up Amount",
          narration: "Narration",
          revisedPrincipal: "Revised Principal Amount",
          revisedMaturity: "Revised Maturity Amount",
          confirmation: "Confirmation",
          successfulTransaction: "Top Up Successful!",
          referenceNumber: "Reference Number {refNo}",
          reset: "Reset",
          review: "Review",
          cancel: "Cancel",
          confirm: "Confirm",
          done: "Done",
          revisedInterestRate: "Revised Interest Rate",
          transactionMessage: "Top Up successful for {amount}!",
          unitMessage: "Top Up should be in multiples of {unit}.",
          limitMessage: "Maximum Top Up should be {max}.",
          currentPrincipal: "Current Principal Amount",
          selectAccount: "Select Account",
          transactionName: "TD Top up",
          currentBalance: "Current Balance",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected"
        },
        maturityInstructions: {
          maturityInstruction: "Maturity Instruction",
          A: "Close on Maturity",
          I: "Renew Principal and Interest",
          P: "Renew Principal and Pay Out the Interest",
          S: "Renew Special Amount and Pay Out the Remaining Amount",
          T: "Renew Interest and Pay Out the Principal",
          redemptionInstruction: "Redemption Instructions",
          transferToAccount: "Complete transfer to account",
          additionalInfo: "Additional Information",
          N: "No Instruction set",
          editMaturityDetails: "Edit Maturity Details",
          calculateMaturity: "Calculate Maturity",
          revisedMaturityInstruction: "Revised Maturity Instruction",
          maturityInstructionsMessage: {
            A: "Entire maturity and interest amount will be transferred to the specified account",
            I: "Entire maturity and interest amount will be renewed again into a fresh term deposit",
            P: "Principal amount will be renewed into a fresh term deposit, whereas the interest amount will be paid out to the specified account",
            S: "Specified amount will be renewed into a fresh term deposit, whereas the balance amount will be paid out"
          }
        },
        common: {
          successful: "Successful!"
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
  return new TermDepositTopUp();
});