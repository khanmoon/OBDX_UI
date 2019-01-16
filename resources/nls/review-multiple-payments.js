define([

  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Generic, Common) {
  "use strict";
  var ReviewMultiplePaymentsLocale = function() {
    return {
      root: {
        label: {
          payee: "Payee {count}",
          title: "Multiple Transfers",
          expandall: "Expand All",
          collapseall: "Collapse All",
          altexpandall: "Expand All",
          altcollapseall: "Collapse All",
          valueDate: "Value Date",
          header: "Multiple Transfers"

        },

        list: {
          label: {
            payee: "Payee",
            fromaccount: "From Account",
            amount: "Amount",
            date: "Date",
            refno: "Reference No.",
            hostrefno: "Host Reference No.",
            status: "Status",
            action: "Action",
            eReceipt: "eReceipt"
          },
          status: {
            200: "Completed",
            202: "Initiated",
            error: "Error",
            success: "Successful!"
          }
        },
        message: {
          info: "You have initiated {number} new fund transfers. Please review the details before you confirm!",
          successMessage: "Transfers initiated successfully.",
          failureMessage: "Transfers initiated successfully. Some transfers seem to have failed."
        },
        payments: {
          moneytransfer: {
            recipient: "Payee",
            accountNumber: "Account Number",
            transferfrom: "Transfer From",
            amount: "Amount"
          },
          generic: Generic,
          common: Common.payments.common
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
  return new ReviewMultiplePaymentsLocale();
});