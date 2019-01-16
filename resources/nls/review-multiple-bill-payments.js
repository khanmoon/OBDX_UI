define([

  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Generic, Common) {
  "use strict";
  var ReviewMultiplePaymentsLocale = function() {
    return {
      root: {
        billPayment: {
          biller: "Biller",
          relationshipNumber: "Relationship No.",
          amount: "Amount",
          transferFrom: "Pay From"
        },
        label: {
          bill: "Bill {count}",
          billNumber: "Bill Number",
          billDate: "Bill Date",
          title: "Multiple Bill Payments",
          note: "Note",
          valueDate: "Value Date",
          header: "Multiple Bill Payments"

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
          info: "You have initiated {number} new bill payments. Please review the details before you confirm!",
          successMessage: "Bill payments initiated successfully.",
          failureMessage: "Bill payments initiated successfully. Some payments seem to have failed."
        },
        payments: {
          moneytransfer: {
            recipient: "Payee",
            accountNumber: "Account Number",
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