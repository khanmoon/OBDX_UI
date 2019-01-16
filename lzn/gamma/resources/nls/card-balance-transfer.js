define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var cardBalanceTransferLocale = function() {
    return {
      root: {
        cardIssuerName: "Card Issuer",
        payeeName: "Payee Name",
        optional: "(optional)",
        cardNumber: "Card Number",
        transferAmount: "Transfer Amount",
        primaryCard: "Primary Card",
        balanceTransferCard: "Balance Transfer {index}",
        additionalCard: "Additional Card",
        addAnotherCard: "Transfer another balance",
        removeCard: "Remove Card",
        balanceTransferInfoText: "What is a balance transfer?",
        isBalanceTransferAllowed: "Transfer a balance to my new credit card",
        balanceTransfer: "Balance Transfer",
        balanceTransferInfo: "You may transfer up to {noOfCards} balances from any cards. Balance transfers may be subject to a fee. Please review the Pricing and Terms.",
        balanceTransferClick: "Click For Transfer Balance",
        balanceTransferOnClick: "Click For Balance Transfer",
        removeCardClick: "Click For Card Remove",
        removeCardOnClick: "Click For card removal",
        removeCardClickInfo: "Click For card Removal",
        editCardClick: "Click For Edit Card",
        editCardClickInfo: "Click For Edit Card Info",
        addCardClick: "Click For Add Card",
        addCardClickInfo: "Click For Add Card Info",
        additionalCardClickInfo: "Click For Additional Card Info",
        additionalCardClick: "Click For Additional Card",
        messages: {
          cardNumber: "Please enter a valid card number",
          payeeName: "Please enter a valid payee name",
          cardIssuerName: "Please enter a valid issuer name"
        },
        generic: Generic
      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new cardBalanceTransferLocale();
});