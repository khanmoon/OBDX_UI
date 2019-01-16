define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          managerecipients_header: "Manage Payees",
          payee: {
            displayName: "{group} - {payee}",
            accountNumber: "Account Number",
            confirmAccountNumber: "Confirm Account Number",
            accountName: "Account Name",
            review: "Review",
            paymenttype: "Payment Type",
            accountType: "Account Type",
            accountBranch: "Branch",
            securityCode: "Security Code",
            branchDetails: "Bank Details",
            type: {
              INTERNAL: "Internal",
              DOMESTIC: "Domestic",
              INTERNATIONAL: "International"
            },
            domestic: {
              accountnumber: "Account Number",
              accounttype: "Account Type",
              paymenttype: "Payment Type",
              payvia: "Pay Via",
              accountnickname: "Nickname",
              modeofdelivery: "Mode of Delivery",
              payeeaccesstype: "Access type",
              accdomestic: "Domestic",
              invalidError: "Invalid ifsc code",
              review: "Review",
              reviewHeader: "You initiated a request for Domestic Bank Account Payee. Please review details before you confirm!",
              india: {
                NEFT: "NEFT",
                RTGS: "RTGS",
                IMPS: "IMPS",
                ifsc: "IFSC Code",
                lookupifsccode: "Lookup IFSC Code",
                lookupifsccodeTitle: "Click to view IFSC Codes",
                searchifsccode: "Search IFSC Code",
                selectifsccode: "Select IFSC Code",
                recipientname: "Payee Name"
              },
              uk: {
                sortcode: "Sort Code",
                swiftcode: "SWIFT Code",
                URGENT: "Urgent",
                "NON URGENT": "Non-urgent",
                FASTER: "Faster",
                lookupsortcode: "Lookup Sort Code",
                lookupswiftcode: "Lookup SWIFT Code"
              },
              sepa: {
                recipientaccnumber: "Account Number (IBAN)",
                bankcodebic: "Bank Code (BIC)",
                bankcode: "Bank Code",
                CAT: "Card",
                CRT: "Credit",
                debtorid: "Debtor Id",
                debtorname: "Debtor Name",
                lookupbankcode: "Lookup Bank BIC Code",
                debtoraccnumber: "Debtor Account Number (IBAN)",
                cardtransfer: "Card Payment",
                credittransfer: "Credit Transfer",
                accountName: "Account Name",
                debtorbankcode: "Debtor Bank Code (BIC)"
              }
            }
          },
          common: {
            pay: "Pay",
            today: "Today",
            issue: "Issue",
            reset: "Reset",
            DeliveryLocation: "Delivery Location",
            note: "Note (Optional)",
            "note-review": "Note",
            verify: "Verify"
          },
          messages: Messages,
          generic: Generic
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
  return new TransactionLocale();
});