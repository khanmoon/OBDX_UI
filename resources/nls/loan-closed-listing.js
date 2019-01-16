define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var LoanClosedListingModel = function() {
    return {
      root: {
        cardDetails: {
          balance_heading: "Outstanding Amount",
          convetional: "Conventional",
          islamic: "Islamic",
          listingPercent: "@ {value}"
        },
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
  return new LoanClosedListingModel();
});