define([], function() {
  "use strict";
  var LimitsWigetLocale = function() {
    return {
      root: {
        amountUtilizationStatus: "Amount Utilization Status",
        viewAll: "View All",
        viewAllTitle: "Click here to view all {typeOfWidget} limits",
        viewAllAlt: "Click here to view all {typeOfWidget} limits",
        limitUsed: "{utilizedAmount} of {totalAmount} used",
        please_select: "Please select",
        nolimits:"Currently no limits are assigned to this transaction. Please contact administrator for further details.",
        maxAmount: "Max Amount:",
        minAmount: "Min Amount:",
        heading: {
          USER: "My Limits",
          PARTY: "Corporate Limits"
        },
        amounts: {
          min: "Min. Amount",
          max: "Max. Amount"
        },
        periodicity: {
          daily: "Daily",
          monthly: "Monthly"
        },
        labels: {
          PC_F_INTRNL: "Internal Transfer",
          PC_F_DOM_IMPS: "Domestic Transfer- IMPS",
          PC_F_DOM_RTGS: "Domestic Transfer- RTGS",
          PC_F_DOM_NEFT: "Domestic Transfer- NEFT",
          PC_F_DOMDRAFT: "Domestic Draft",
          PC_F_DOM: "Domestic Payment",
          PC_F_IT: "International Payout",
          PC_F_ID: "International Draft",
          PC_F_SELF: "Self Transfer",
          FU_F_MFT: "Mixed Payment- File Level Approval",
          FU_F_DFT: "Domestic Payment- File Level Approval",
          FU_F_IFT: "Internal Transfer- File Level Approval",
          PC_F_BLPMT: "Bill Payment"
        }
      }
    };
  };
  return new LimitsWigetLocale();
});
