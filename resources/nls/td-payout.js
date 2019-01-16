define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var TermDepositPayout = function() {
    return {
      root: {
        payoutInstructions: {
          payoutInstructions: "Payout Details",
          maturityInstruction: "Maturity Instruction",
          accTransferOption: "Account Transfer Option",
          networkType: "Network Type",
          accNumber: "Account Number",
          accName: "Account Name",
          bankCode: "Bank Code",
          payoutType: "Payout Type",
          submit: "Submit",
          bankAddress: "Bank Address",
          or: "or",
          lookUpBankCode: "Look Up Bank Code",
          payTo: "Pay To",
          paidTo: "Paid to",
          transferTo: "Transfer Account",
          bankname: "Bank Name",
          branch: "Branch",
          address: "Address",
          enterValidAccount: "Enter valid account number",
          renewAmount: "Roll over Amount",
          networkTypeMessage: "Please select Domestic Network Type"
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
  return new TermDepositPayout();
});