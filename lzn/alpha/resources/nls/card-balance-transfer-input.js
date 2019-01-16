define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var cardBalanceTransferInputLocale = function() {
    return {
      root: {
        cardIssuerName: "Card Issuer Name",
        payeeName: "Payee Name",
        cardNumber: "Card Number",
        transferAmount: "Transfer Amount",
        messages: {
          cardNumber: "Please enter a valid card number",
          payeeName: "Please enter a valid payee name",
          issuerName: "Please enter a valid issuer name"
        },
        generic: Generic
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
  return new cardBalanceTransferInputLocale();
});