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
          myaddress: "My Address",
          branchaddress: "Branch Address",
          payee: {
            DOMESTIC: "Domestic",
            INTERNAL: "Internal",
            INTERNATIONAL: "International",
            DEMANDDRAFT: "Demand Draft",
            PEERTOPEER: "Peer to peer",
            addnewrelationship: "Add New Payee",
            newAccount: "Add Account",
            whichaccount: "What type of information would you like to add to this Payee?",
            bankaccount: "Bank Account",
            demanddraft: "Demand Draft",
            demanddraftalt: "Demand Draft",
            bankaccountalt: "Bank Account",
            internal: {
              internalaccount: "Internal Account"
            },
            domestic: {
              sepa: {
                cardTransfer: "Card Payment",
                creditTransfer: "Credit Transfer"
              }
            }
          },
          networktype: {
            SWI: "Swift Code",
            NAC: "National Clearing Code",
            SPE: "Bank Details",
            SWIFT: "SWIFT Code",
            SORT: "SORT Code",
            BANK: "Bank Details",
            NEFT: "NEFT",
            RTGS: "RTGS",
            "Card Payment": "Card Payment",
            "Credit Transfer": "Credit Transfer"
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