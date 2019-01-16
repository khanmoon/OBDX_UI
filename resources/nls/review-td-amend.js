define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewTermDepositAmend = function() {
    return {
      root: {
        common: {
          reviewHeader: "You initiated a request for Edit Maturity Instructions for Deposit. Please review details before you confirm!",
          maturityInstructions: {
            maturityInstruction: "Maturity Instruction",
            CON: {
              A: "Close on Maturity",
              I: "Renew Principal and Interest",
              P: "Renew Principal and Pay Out the Interest",
              S: "Renew Special Amount and Pay Out the Remaining Amount",
              T: "Renew Interest and Pay Out the Principal"
            },
            ISL: {
              A: "Close on Maturity",
              I: "Renew Principal and Profit",
              P: "Renew Principal and Pay Out the Profit",
              S: "Renew Special Amount and Pay Out the Remaining Amount",
              T: "Renew Profit and Pay Out the Principal"
            },
            revisedMaturityInstruction: "Revised Maturity Instruction"
          },
          review: "Review"
        },
        transactions: {
          termDepositDetails: {
            depositDetails: {
              revisedMaturity: "Revised Maturity Amount"
            },
            payoutInstructions: {
              payTo: "Pay To",
              renewAmount: "Roll over Amount",
              account: "Account Number",
              branch: "Branch",
              payoutType: {
                I: "Internal Account",
                O: "Own Account",
                E: "Domestic Bank Account"
              },
              transferAccount: "Transfer Account"
            }
          },
          amendTD: {
            transactionMessage: "Your Term Deposit maturity instruction has been modified!",
            referenceNumber: "Reference Number {refNo}",
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
        generic: Generic,
        header: "Edit Maturity Instruction"
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
  return new ReviewTermDepositAmend();
});
