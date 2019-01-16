define([], function() {
  "use strict";
  var AccountNicknameLocale = function() {
    return {
      root: {
        searchFields: {
          labels: {
            acccountNumber: "Account Number",
            addNickname: "Add Nickname",
            nickname: "Nickname",
            nicknameInput: "Enter Nickname",
            customerName: "Customer Name",
            customerID: "Customer ID",
            netBalance: "Net Balance",
            currentBalance: "Current Balance",
            netOutStandingBalance: "Net Outstanding Balance",
            cardNumber: "Card Number",
            validity: "Validity",
            validityFrom: "Validity From",
            validityTo: "Validity To",
            internationalTransactions: "International Transactions",
            activate: "Active",
            deactivate: "Inactive",
            cardType: "Card Type",
            PRIMARY: "Primary",
            ADDON: "Add-On",
            saveButton: "Save Nickname",
            saveText: "Click here to Save Nickname",
            goBackButton: "Go Back",
            backText: "Click here to go back",
            edit: "Edit Nickname",
            editText: "Click here to Edit nickname",
            delete: "Delete Nickname",
            deleteText: "Click here to delete nickname",
            add: "Add Nickname",
            addText: "Click here to Add Nickname"
          }
        },
        messages: {
          invalidNickname: "Please enter valid Nickname"
        }
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
  return new AccountNicknameLocale();
});
