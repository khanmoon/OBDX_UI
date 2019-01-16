define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var reviewScanToPay = function() {
    return {
      root: {
        header: "Scan To Pay",
        transferTo: "Transfer To",
        transferFrom: "Transfer From",
        amount: "Amount",
        notes: "Notes (Optional)",
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
  return new reviewScanToPay();
});