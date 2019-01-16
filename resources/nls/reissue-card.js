define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var ReIssueCardLocale = function() {
    return {
      root: {
        DeliveryLocation: "Delivery Location",
        reissueDebitCard: "Debit Card Re-Issue",
        debitCards: {
          customerName: "Customer Name",
          cardType: "Card Type",
          accountNo: "Account Number",
          cardNumber: "Card Number",
          nameOnCard: "Name on Card",
          fullName: "{firstName} {middleName} {lastName}",
          validThru: "Valid Thru",
          status: "Status"
        },
        transactionName: "Debit Card Re-Issue",
        reviewHeading: "Review",
        reviewHeading1: "You initiated a request to reissue Debit Card. Please review details before you confirm!",
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
  return new ReIssueCardLocale();
});
