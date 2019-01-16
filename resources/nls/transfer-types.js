define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          standinginstructions: {
            msgtype: {
              table: {
                INDIADOMESTICFT_SI: "Domestic Transfer",
                DOMESTICFT: "Domestic Transfer",
                INTERNALFT_SI: "Internal Transfer",
                INTERNATIONALFT_SI: "International Transfer",
                UKDOMESTICFT_SI: "Domestic Transfer",
                SEPADOMESTICFT_SI: "Domestic Transfer",
                SELFFT_SI: "Self Transfer",
                INDIADOMESTICFT_PAYLATER: "Domestic Transfer",
                INTERNALFT_PAYLATER: "Internal Transfer",
                INTERNATIONALFT_PAYLATER: "International Transfer",
                UKDOMESTICFT_PAYLATER: "Domestic Transfer",
                INTERNATIONALDRAFT_PAYLATER: "International Draft",
                DOMESTICDRAFT_PAYLATER: "Domestic Draft",
                SEPADOMESTICFT_PAYLATER: "Domestic Transfer",
                DOMESTICDRAFT: "Domestic Draft",
                INTERNATIONALDRAFT: "International Draft",
                SELFFT_PAYLATER: "Self Transfer",
                myaddress: "My Address",
                BILLPAYMENT: "Bill Payment",
                branchaddress: "Branch Address",
                DOMESTICFT_SI: "Domestic Transfer"

              },

              INDIADOMESTICFT_SI: "Domestic",
              DOMESTICFT: "Domestic",
              INTERNALFT_SI: "Internal",
              INTERNATIONALFT_SI: "International",
              UKDOMESTICFT_SI: "Domestic",
              SEPADOMESTICFT_SI: "Domestic",
              SELFFT_SI: "Self",
              INDIADOMESTICFT_PAYLATER: "Domestic",
              INTERNALFT_PAYLATER: "Internal",
              INTERNATIONALFT_PAYLATER: "International",
              UKDOMESTICFT_PAYLATER: "Domestic",
              INTERNATIONALDRAFT_PAYLATER: "International",
              DOMESTICDRAFT_PAYLATER: "Domestic",
              SEPADOMESTICFT_PAYLATER: "Domestic",
              DOMESTICDRAFT: "Domestic Draft",
              INTERNATIONALDRAFT: "International",
              SELFFT_PAYLATER: "Self",
              SELFFT: "Self",
              myaddress: "My Address",
              BILLPAYMENT: "Bill Payment",
              branchaddress: "Branch Address",
              DOMESTICFT_SI: "Domestic",
              REC: "Repeat Transfer",
              NONREC: "Scheduled Single Payment"

            }

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
  return new TransactionLocale();
});