define([], function() {
  "use strict";
  var PaymentQuicklinksResource = function() {
    return {
      root: {
        "payments-quick-links": "Payments",
        "quick-access": "Quick Access",
        sendMoney: "Transfer Money",
        favorites: "Favorites",
        payBills: "Pay Bills",
        managePayeesBillers: "Manage Payees & Billers",
        viewSI: "View Repeat Transfers",
        requestMoney: "Request Money",
        CASAStatement: "View Statement",
        requestChequeBook: "Cheque Book Request",
        newDebitCard: "New Debit Card",
        newDeposit: "New Deposit",
        installmentCalculator: "Installment Calculator",
        eligiblityCalculator: "Eligibility Calculator",
        title: {
          CASAStatement: "Click here for Saving or Current Account Statement",
          requestChequeBook: "Click here for Cheque Book Request",
          newDebitCard: "Click here for New Debit Card",
          newDeposit: "Click here for New Term Deposit",
          installmentCalculator: "Click here for Installment Calculator",
          eligiblityCalculator: "Click here for Eligibility Calculator",
          payments: "Click here to make payments",
          viewSI: "Click here to view your standing instructions",
          managePayeesBillers: "Click here to manage payees & billers",
          sendMoney: "Click here to send money",
          payBills: "Click here to pay bills",
          requestMoney: "Click here to Transfer Money"
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
  return new PaymentQuicklinksResource();
});