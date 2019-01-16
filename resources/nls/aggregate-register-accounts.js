define([], function() {
  "use strict";
  var AggregateAccountsLocale = function() {
    return {
      root: {
        heading: {
          registerAccount: "Register External account"
        },
        labels: {
          selectAccount: "Select Account",
          regAccount: "Your External Bank accounts has been registered successfully.",
          accountSummary:"External Bank account List",
          next:"What would you like to do next?",
          ok:"Ok",
          linkAccount:"Link Account",
          backtoDashboard:"Back to Main Dashboard",
          CSA: "Current & Savings",
          LON: "Loans and Finances",
          TRD: "Term Deposits",
          RD: "Recurring Deposits",
          CCA: "Credit Card",
          addAccount: "Add Account",
          cancel: "Cancel"
        },
        subHeaders: {
          LON: "Apply online and get instant approval!",
          TRD: "Earn interest on your deposits. Open instantly!",
          CCA: "You do not have any credit cards!"
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
  return new AggregateAccountsLocale();
});
