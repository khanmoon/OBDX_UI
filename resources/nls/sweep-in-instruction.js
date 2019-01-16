define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var SecurityMenu = function() {
    return {
      root: {
        title:"Sweep-in",
        labels: {
          SweepIn:"Sweep-in",
          linkedAccount:"Linked  Account",
          providerAccount:"Provider Accounts",
          casa  :"Current and Savings",
          td   :" Fixed Deposit",
          accountNo:"Account Number",
          partyName:"Primary Holder Name",
          balance:"Balance",
          action:"Action",
          add:"Add",
          hide:"Hide",
          new:"New",
          maturityDate:"Maturity Date",
          principalAmount:"Principal Amount",
          DepositNo:"Deposit Number",
          warning:"Warning",
          review: "Review",
          failed:"Failed",
          completed:"Completed",
          reviewHeader:"You initiated a request for linking new account(s). Please review all your new and existing linking requests before you confirm.",
          deleteConfirmationMessage:"Are you sure you want to delink this account?",
          cancelMessage:"Are you sure you want to cancel the operation?",
          delinkMessage:"Click here to delink this account",
          imageForNote:"Image For Note"
        },
      tableHeading: {

        },
        message: {
          successMessage: "Sweep-in Request Submitted successfully.",
          failureMessage: "Sweep-in Request initiated successfully. Some Request seem to have failed."
        },
        errorMessage: {
          AllAccountsLinked: "All the accounts are already linked to this beneficiary account. You do not have any more Provider accounts to be linked.",
          noCasaAccountAvailable: "Sorry!  You do not have any Current and Savings accounts available for linking. You need to have two or more accounts to carry out this transaction.",
          noTdAccountAvailable: "Sorry!  You do not have any Deposits available for linking. You need to have at least one Fixed Deposit to carry out this transaction.",
          selectAtLeastOneAccount: "Please select at least one account for linking."
        },
        noAccountsMessage: {
          noCasaAccountAvailable: "No linked accounts to display. Please click on Add to link your accounts.",
          noTdAccountAvailable: "No linked deposits to display. Please click on Add to link your deposits."
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
  return new SecurityMenu();
});
