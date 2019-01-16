define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var TermDepositAmend = function() {
    return {
      root: {
        amendTD: {
          transactionMessage: "Your Term Deposit maturity instruction has been modified!",
          referenceNumber: "Reference Number {refNo}",
          initiationMessage: "Transaction has been initiated successfully and is pending for approval",
          editMaturityDetails: "Edit Maturity Instruction",
          invalidBankCode: "Please validate bank code by clicking on Submit",
          selectAccount: "Select Account",
          maturityInstruction: "Maturity Instruction",
          renewAmount: "Roll over Amount",
          transactionName: "TD Amend",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected"
        },
        maturityInstructions: {
          A: "Close on Maturity",
          I: "Renew Principal and Profit",
          P: "Renew Principal and Pay Out the Profit",
          S: "Renew Special Amount and Pay Out the Remaining Amount",
          T: "Renew Profit and Pay Out the Principal"
        },
        common: {
          successful: "Successful!"
        },
        placeholder: {
          pleaseSelect: "Please Select",
          holderName: "Account Holder Name",
          selectAccount: "Select Account",
          currency: "Currency"
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
  return new TermDepositAmend();
});