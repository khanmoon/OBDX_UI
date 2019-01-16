define([], function() {
  "use strict";
  var PaymentActionCardCallLocale = function() {
    return {
      root: {
        payments: {
          billpayment: {
            title: "Pay Bills",

            imgDesc: "Pay Bills"
          },
          moneytransfer: {
            title: "Transfer Money",

            imgDesc: "Transfer Money"
          },
          demanddraft: {
            title: "Issue Demand Drafts",

            imgDesc: "Issue demand Drafts"
          },
          requestmoney: {
            title: "Request Money",

            imgDesc: "Request Money"
          },
          managebiller: {
            title: "Manage Billers",

            imgDesc: "Manage Billers",
            linkText: "View All ({count})"
          },
          managepayees: {
            title: "Manage Payees",

            imgDesc: "Manage Payees",
            linkText: "View All ({count})"
          },
          managedebtor: {
            title: "Manage Debtors",

            imgDesc: "Manage Debtors",
            linkText: "View All ({count})"
          },
          scheduledPayments: {
            title: "Upcoming Payments",

            imgDesc: "Upcoming Payments"
          },
          standinginstruction: {
            title: "Standing Instruction",

            imgDesc: "Standing Instruction",
            linkText: "View All ({count})"
          }
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
  return new PaymentActionCardCallLocale();
});