define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var reviewCreateRd = function() {
    return {
      root: {
        header: {
          newRecurringDeposit: "New Recurring Deposit",
          reviewHeader: "You Initiated a request for New Recurring Deposit. Please review details before you confirm!"
        },
        pageHeader: {
          depositDetails: "Deposit Details",
          maturityDetails: "Maturity Details",
          nominationDetails: "Nomination Details"
        },
        nominationDetails: {
          nomination: "Nomination",
          nominationStatus: {
            true: "Registered",
            false: "Not Registered"
          }
        },
        depositDetail: {
          sourceAccount: "Source Account",
          depositAmount: "Deposit Amount",
          tenure: {
            singular: {
              month: "{n} Month",
              year: "{n} Year"
            },
            plural: {
              month: "{n} Months",
              year: "{n} Years"
            }
          },
          holdingPattern: "Holding Pattern",
          depositTenure: "Deposit Tenure",
          primaryAccountHolder: "Primary Account Holder",
          tenureDetail: "{years}, {months}",
          product: "Product",
          jointAccHolder: "Joint Account Holder {accountHolder}",
          rateOfInterest: "Rate of Interest",
          holdingPatternType: {
            SINGLE: "Single",
            JOINT: "Joint"
          }
        },
        maturityDetail: {
          rollOverType: {
            A: "Close on Maturity"
          },
          maturityInstruction: "Maturity Instruction",
          payTo: "Pay To",
          payoutType: {
                I: "Internal Account",
                O: "Own Account",
                E: "Domestic Bank Account"
              },
          creditAccountNum: "Principal & Interest Credit Account Number"
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
  return new reviewCreateRd();
});
