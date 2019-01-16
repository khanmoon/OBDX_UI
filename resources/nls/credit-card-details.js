define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var creditCardDetailsLocale = function() {
    return {
      root: {

        creditCardDetails: {
          cardHeading: "Credit Card Details",
          cardStatus: "Card Status",
          billing: "Billing",
          totalAmountDue: "Total Amount Due",
          dueDate: "Due Date",
          billCycle: "Billing Cycle",
          ofmonth: "Day {billCycle} of every month",
          day: "Day",
          rewardPoint: "{rewardPoints} Reward Points",
          rewards: "Rewards",
          rewardsMsg: "Your points give you access to an exciting range of rewards.",
          validFrom: "Validity From",
          validTo: "Validity To",
          internationalTransactions: "International Transactions",
          internationalFlagMsgD: "You are about to deactivate international transactions for this credit card. You wont be able to use this card in any international locations until you activate this feature.",
          internationalFlagMsgA: "You are about to activate international transactions for this credit card. You will be able to use this card in any international locations until you deactivate this feature.",
          internationalFlagMsgHeaderD: "Deactivate International Transactions",
          internationalFlagMsgHeaderA: "Activate International Transactions",
          yesD: "Deactivate",
          yesA: "Activate",
          redeemPoints: "Redeem Points",
          logOffMsg: "You will be redirected to another website and logged out here. Do you want to proceed?",
          ofeverymonth: "of every month",
          billcyclemsg: "Please Select Bill Cycle",
          billcycleheading: "Update Bill Cycle",
          reviewBillCycleMsg: "Are you sure you want to update bill cycle of credit card?",
          selectedCard: "Select Card",
          addInfo: "Additional Information",
          ACT: "Active",
          IAT: "Inactive",
          HTL: "Hotlisted",
          CLD: "Cancelled",
          deactivate: "Inactive",
          activate: "Active",
          activateCardHeader: "Activate Card",
          N: "New",
          D: "Deactive",
          pleaseSelect: "Please Select",
          activateCardHeaderMsg: "Please select a reason for card activation",
          selectReason: "Reason",
          comment: "Comments (optional)",
          comments: "Comments",
          cardNumber: "Card Number",
          confirmBillCycle: "Click here to update bill cycle",
          activateDeactivateHeader:"Activate/Deactivate International Transactions",
          cardLimit: {
            serviceRequestNumber: "Service Request Number is {refNo}",
            cardLimits: "Limits",
            availableCredit: "Available Credit",
            totalCredit: "Total Credit",
            availableCash: "Available Cash",
            totalCash: "Total Cash",
            available: "Available",
            update: "Update",
            transactionName: "Update Limits",
            reviewLimitMsg: "Are you sure you want to update the available credit and available cash?",
            limitError: "Available limit should not be greater than total limit"
          }
        },
        cardLinks: {
          viewStatement: "View Statement",
          cardPayment: "Card Payment",
          requestPin: "Request PIN",
          blockCard: "Block/Cancel Card",
          autoPay: "Auto Pay",
          resetPin: "Reset PIN",
          addOnCard: "Add-On Card"
        },
        massage: {
          activateMassege: "Do you want to Activate International Transactions?",
          deActivateMassege:"Are you sure you want to Deactivate International Transactions?"
        },
        genericCard: Generic.common
      }
    };
  };
  return new creditCardDetailsLocale();
});
