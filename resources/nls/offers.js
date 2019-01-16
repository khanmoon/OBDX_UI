define([], function() {
  "use strict";
  var offers = function() {
    return {
      root: {
        header: "Offers",
        viewAll: "View All",
        title: "Click here to view all offers",
        imgName: "Offer on {imageName}",
        bankPromotionalOffers: "View Bank Promotional Offers"
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
  return new offers();
});