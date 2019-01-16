define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var DebitCardDetails = function() {
    return {
      root: {
        validityFrom: "Validity From",
        validityTo: "Validity To",
        blockCard: "Block Card",
        manageCard: "Manage Card",
        active: "Active",
        block: "Blocked",
        transactionName: "Unblock Debit Card",
        header:"Block/Unblock Cards",
        blockMassege: "Do you want to block the card?",
        unBlockMassege:"Are you sure you want to Unblock card?",
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
  return new DebitCardDetails();
});
