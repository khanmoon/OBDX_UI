define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
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
        balanceTransferClick: "Transfer Balance",
        balanceTransferClickTitle: "Click For Transfer Balance",
        removeCardClick: "Click For Card Remove",
        editCardClick: "Click For Edit Card",
        addCardClick: "Click For Add Card",
        additionalCardClick: "Click For Additional Card",
        empRemoveCardClickTitle: "Click To Remove Card",
        empRemoveCardClick: "Remove Card",
        messages: {
          cardNumber: "Please enter a valid card number",
          payeeName: "Please enter a valid payee name",
          cardIssuerName: "Please enter a valid issuer name"
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
  return new cardBalanceTransferLocale();
});