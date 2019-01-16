define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var dashboardLocale = function() {
    return {
      root: {
        productGroupDescription: {
          PAYDAY: "Payday Loan",
          AUTOLOANFLL: "Vehicle Loans",
          PERSONAL_LOAN: "Personal Loans",
          SAVINGS: "Savings",
          CHECKING: "Current Accounts",
          AUTOMOBILE: "Auto Loans"
        },
        amountTenure: "{productGroup} <span class='{class1}'> of amount <span class='{class2}'>{amount}</span> for tenure <span class='{class2}'>{years} year(s)</span></span>",
        CASA: "Savings",
        TERM_DEPOSITS: "Term Deposits",
        LOANS: "Loans",
        CREDIT_CARD: "Credit Cards",
        productGroupsHeader: {
          class: "{productClass}_{productSubClass}",
          CASA_SAVINGS: "Explore our Savings products",
          CASA_CHECKING: "Explore our Current Accounts products",
          TERM_DEPOSITS: "Explore our Term Deposits products",
          CREDIT_CARD: "Explore our Credit Cards products",
          LOANS_AUTOMOBILE: "Explore our Auto Loans products",
          LOANS_PERSONAL_LOAN: "Explore our Personal Loans products",
          LOANS_LOANS: "Explore our Mortgage Loans products",
          LOANS_PAYDAY: "Explore our Payday Loans products"
        },
        homePageTitle: "Welcome To Oracle Banking Digital Experience",

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
  return new dashboardLocale();
});