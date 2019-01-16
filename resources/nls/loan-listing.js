define([], function(Generic) {
  "use strict";
  var LoanListingModel = function() {
    return {
      root: {
        cardDetails: {
          balance_heading: "Outstanding Amount",
          listingPercent: "@ {value}",
          islamic: "Islamic",
          conventional: "Conventional"
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
  return new LoanListingModel();
});