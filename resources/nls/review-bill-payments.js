define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Generic, Common) {
  "use strict";
  var ReviewBillPayment = function() {
    return {
      root: {
        billPayment: {
          header: "Bill Payment Details",
          payto: "Pay to",
          amount: "Amount",
          transferFrom: "Pay From",
          billNumber: "Bill Number",
          billDate: "Bill Date",
          noteReview: "Note",
          billerName: "Biller Name",
          relationshipNumber: "Relationship No.",
          review: "Review",
          reviewHeaderMsg: "You initiated a request for Bill Payment. Please review details before you confirm!"
        },
        generic: Generic,
        common: Common.payments.common
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
  return new ReviewBillPayment();
});