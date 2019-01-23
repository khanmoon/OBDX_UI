define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var redeemRD = function() {
    return {
      root: {
        header: {
          redemption: "Redemption"
        },
        pageHeader: {
          redemptionDetails: "Redemption Details",
          payoutDetails: "Payout Details"
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
          creditAccountNum: "Principal & Interest Credit Account Number",
          payTo: "Pay To",
          accountName: "Account Name",
          bankCode: "Bank Code",
          lookUpBankCode: "Look Up Bank Code"
        },
        validate:{
          holdingPattern:"This facility is available for singly held deposits only."
        },
        redeem: "Redeem",
        pleaseSelect: "Please Select",
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
