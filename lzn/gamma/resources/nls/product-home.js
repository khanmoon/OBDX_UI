define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var accountHolderLocale = function() {
    return {
      root: {
        compName: "product-home",
        "account_header": "Savings",
        "checking_header": "Checking",
        "deposit_header": "Deposits",
        "card_header": "Credit Cards",
        "securedLoan_header": "Personal Loans",
        "unsecuredLoan_header": "Auto Loans",
        selectState: "Select State",
        selectResidence: "Please Select Your State of Residence",
        stateDisclaimer: "Product offerings may differ across locations. By selecting your state of residence you will be shown the specific terms and rates that will apply to your new account.",
        wrongStateMsg: "We cannot open your account as your state of residence does not match the state you have selected. Please contact the bank for further information.",
        homePage: "Go to Homepage",
        productGroupDescription: {
          PAYDAY: "Payday Loan",
          AUTOLOANFLL: "Vehicle Loans"
        },
        productGroupsHeader: {
          class: "{productClass}_{productSubClass}",
          CASA_SAVINGS: "Explore our Savings products",
          CASA_CHECKING: "Explore our Checkings products",
          TERM_DEPOSITS: "Explore our Certificate of Deposits products",
          CREDIT_CARD: "Explore our Credit Cards products",
          LOANS_AUTOMOBILE: "Explore our Auto Loans products",
          LOANS_PERSONAL_LOAN: "Explore our Personal Loans products",
          LOANS_LOANS: "Explore our Mortgage Loans products",
          LOANS_PAYDAY: "Explore our Payday Loans products"
        },
        messages: {
          state: "Please select a state"
        },
        generic: Generic

      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new accountHolderLocale();
});