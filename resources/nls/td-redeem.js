define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var TermDepositRedeem = function() {
    return {
      root: {
        redeem: {
          header: "Redemption",
          redeem: "Redeem",
          redemptionDetails: "Redemption Details",
          redeemableAmount: "Redeemable Amount",
          redemptionType: "Redemption Type",
          partial: "Partial",
          full: "Full",
          redemptionAmount: "Redemption Amount",
          charges: "Charges/Penalty",
          payoutInstructions: "Payout Details",
          finalRedemption: "Final Redemption Amount",
          referenceNumber: "Reference Number {refNo}",
          currentRedemptionInstruction: "Current Redemption Instructions",
          transactionMessage: "Your Term Deposit redemption is successful!",
          type: {
            F: "Full",
            P: "Partial"
          },
          revisedInterestRate: "Revised Interest Rate",
          initiationMessage: "Transaction has been initiated successfully and is pending for approval",
          invalidBankCode: "Please validate bank code by clicking on Submit",
          selectAccount: "Select Account",
          transactionName: "TD Redeem",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected"
        },
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
          payTo: "Pay to",
          paidTo: "Paid to",
          transferTo: "Transfer Account",
          bankname: "Bank Name",
          branch: "Branch",
          address: "Address",
          enterValidAccount: "Enter valid account number",
          renewAmount: "Roll over Amount",
          networkTypeMessage: "Please select Domestic Network Type"
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
  return new TermDepositRedeem();
});