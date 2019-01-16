define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var redeemRD = function() {
    return {
      root: {
        header: {
          redemption: "Redemption",
          reviewHeader: "You Initaited a request for Deposit Redemption. Please review details before you confirm!"
        },
        redemptionDetails: {
          accountNumber: "Account Number",
          redeemableAmount: "Redeemable Amount",
          redemptionType: "Redemption Type",
          penalty: "Charges/Penalty",
          finalRedemptionAmount: "Final Redemption Amount",
          redeemType: {
            P: "Partial",
            F: "Full"
          }
        },
        payoutDetails: {
          payTo: "Pay To",
          creditAccountNum: "Principal & Interest Credit Account Number",
          payoutType: {
                I: "Internal Account",
                O: "Own Account",
                E: "Domestic Bank Account"
              }
        },
         confirmScreenLabels:{
          recurringDepositNumber :"Recurring Deposit Number",
          createSuccessMessage :"Request Submitted Successfully."
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new redeemRD();
});
