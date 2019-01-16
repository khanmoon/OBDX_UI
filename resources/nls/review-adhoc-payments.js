define(["ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/payments-common",
    "ojL10n!resources/nls/review-internal-payee",
    "ojL10n!resources/nls/review-domestic-payee",
    "ojL10n!resources/nls/review-international-payee"

  ],
  function(Generic, Common, Internal, Domestic, International) {
    "use strict";
    var ReviewAdhocPayments = function() {
      return {
        root: {
          paymentDetails: {
            internationalHeader: "International Fund Transfer Details",
            transferto: "Transfer To",
            amount: "Amount",
            transferon: "Transfer When",
            transferfrom: "Transfer From",
            purpose: "Purpose",
            note: "Note",
            correspondencecharges: "Correspondence Charges",
            paymentdetails: "Payment Details",
            domesticHeader: "Domestic Fund Transfer Details",
            internalHeader: "Internal Fund Transfer Details",
            review: "Review",
            noteReview: "Note"
          },
          internationalPayee: International.internationalPayee,
          domesticPayee: Domestic.domesticPayee,
          internalPayee: Internal.internalPayee,

          reviewAdhocPayments: {
            header: "Adhoc Payment Details",
            recipientname: "Payee Name",
            accountnumber: "Account Number",
            accountName: "Account Name",
            accounttype: "Account Type",
            accinternational: "International",
            accountnickname: "Nickname",
            swiftcode: "SWIFT Code",
            nationalclearingcode: "National Clearing Code (NIC)",
            bankdetails: "Bank Details",
            payeeshared: "Payee Shared",
            payeeaccesstype: "Payee Access Type",
            payvia: "Pay Via",
            ncc: "NCC (National Clearing Code)",
            branch: "Branch",
            Branchcoderesponse: "Branch",
            accinternal: "Internal",
            ifsc: "IFSC Code",
            sepaRecipientaccnumber: "Account Number (IBAN)",
            bankcodebic: "Bank Code (BIC)",
            debtorbankcode: "Debtor Bank Code (BIC)",
            accdomestic: "Domestic",
            transferto: "Transfer To",
            amount: "Amount",
            transferon: "Transfer When",
            transferfrom: "Transfer From",
            purpose: "Purpose",
            note: "Note",
            correspondencecharges: "Correspondence Charges",
            paymentdetails: "Payment Details"
          },
          common: Common.payments.common,
          generic: Generic
        },
        ar: true,
        fr: true,
        cs: true,
        sv: true,
        en: false,
        "en-us": false,
        el: false
      };
    };
    return new ReviewAdhocPayments();
  });