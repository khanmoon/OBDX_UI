define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewTermDepositRedeem = function() {
    return {
      root: {
        common: {
          review: "Review",
          reviewHeader: "You initiated a request for Deposit Redemption. Please review details before you confirm!",
          termDpositHeader: "Redemption"
        },
        transactions: {
          termDepositDetails: {
            depositDetails: {
              revisedMaturity: "Revised Maturity Amount"
            },
            payoutInstructions: {
              payTo: "Pay To",
              branch: "Branch",
              transferAccount: "Transfer Account",
              payoutType: {
                I: "Internal Account",
                O: "Own Account",
                E: "Domestic Bank Account"
              }
            }
          },
          redeem: {
            redeem: "Redeem",
            redemptionDetails: "Redemption Details",
            redeemableAmount: "Redeemable Amount",
            redemptionType: "Redemption Type",
            partial: "Partial",
            full: "Full",
            redemptionAmount: "Final Redemption Amount",
            charges: "Charges/Penalty",
            payoutInstructions: "Payout Details",
            referenceNumber: "Reference Number {refNo}",
            currentRedemptionInstruction: "Current Redemption Instructions",
            transactionMessage: "Your Term Deposit redemption is successful!",
            type: {
              F: "Full",
              P: "Partial"
            },
            revisedInterestRate: "Revised Interest Rate",
            islamicRevisedInterestRate: "Revised Profit Rate",
            tdAccountNumber: "TD Account Number"
          }
        },
        confirmationMsg: {
          FINAL_LEVEL_APPROVED: "You have successfully approved the request.",
          MID_LEVEL_APPROVED: "You have successfully approved the request. It is pending for further approval.",
          REJECT_BY_HOST: "Your request has been rejected.",
          REJECT: "You have rejected the request.",
          INITIATED: "Your request has been initiated successfully.",
          AUTO_AUTH: "Your request has been accepted."
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
  return new ReviewTermDepositRedeem();
});
