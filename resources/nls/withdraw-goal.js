define(
  [],
  function() {
    "use strict";
    var ManageGoalCategory = function() {
      return {
        root: {
          withdrawdisclaimer: "You can withdraw amount from your Goal Account as and when you plan to. Please provide us with the redemption details.",
          currentValue: "My Current Goal Value",
          natureOfWithdrawal: "How much would you like to withdraw from the Goal Account?",
          partial: "Partial",
          full: "Full",
          fullRedeemWarning: "Full withdrawal will lead to the closure of this Goal Account",
          howMuchWouldYouLikeTowithdraw: "How much would you like to withdraw from the Goal Account?",
          withdrawWarning: "You are about to withdraw {withdrawAmount} from your Goal account & transfer to <strong>Account number: {accountNumber}.</strong> Would you like to proceed?",
          withdrawSuccessful: "Withdrawal of {withdrawAmount} has been made from your Goal: {goalDataName} successfully.",
          finalValue: "Final Value",
          back: "Back",
          alt: "Confirmation image",
          description: "Description",
          type: "Type",
          referenceNumber: "Reference Number",
          amount: "Amount",
          tableCaption: "View Transaction",
          date: "Date"

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
    return new ManageGoalCategory();
  }
);