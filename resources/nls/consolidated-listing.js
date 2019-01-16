define([], function() {
  "use strict";
  var ConsolidatedListingLocale = function() {
    return {
      root: {

        cards: {
          name: "Credit Cards",
          balance_heading_main: "Total Amount Due",
          primary_description: "Credit Cards",
          fail_safe_string: "Get exciting privileges with  <br/>our selection of Credit cards",
          more_info: "My Credit Cards",
          title: "Click here to View Credit Card details"
        },
        "demand-deposits": {
          name: "Accounts",
          balance_heading_main: "Total Net Balance",
          primary_description: "Savings & Current",
          fail_safe_string: "Choose from our selection of <br/> accounts",
          more_info: "My Accounts Page",
          title: "Click here to View Savings Account details"
        },
        "term-deposits": {
          name: "Term Deposits",
          balance_heading_main: "Total Current Balance",
          primary_description: "Term Deposits",
          fail_safe_string: "Diversify your portfolio with <br/> our deposits",
          more_info: "My Deposit Page",
          title: "Click here to View Term Deposit details"
        },
        loans: {
          name: "Loans",
          balance_heading_main: "Total Outstanding Amount",
          primary_description: "Loans",
          islamic_description: "Loans & Finances",
          fail_safe_string: "Select products to fulfil your <br/> financial needs",
          more_info: "My Loans Page",
          title: "Click here to View Loan details"
        }
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ConsolidatedListingLocale();
});