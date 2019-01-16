define([
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Generic, Common) {
  "use strict";
  var ReviewBillerDetails = function() {
    return {
      root: {
        biller: {
          header: "Biller Details",
          category: "Category",
          relationship1: "Relationship No 1",
          relationship2: "Relationship No 2",
          relationship3: "Relationship No 3",
          billerName: "Biller Name",
          reviewHeaderEditMsg: "You initiated a request for editing Registered Biller. Please review details before you confirm!",
          reviewHeaderDeleteMsg: "You initiated a request for deleting Registered Biller. Please review details before you confirm!"

        },
        common: Common.payments.common,
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
  return new ReviewBillerDetails();
});