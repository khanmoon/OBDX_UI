define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var AboutLocale = function() {
    return {
      root: {
        searchVehicle: "Search Cars and Apply",
        searchVehicleHeader: "Find and finance your car <span class='{class2}'>with</span> ZigBank",
        applyNow: "Apply Now",
        bestDeal: "Help me get the best deal",
        jumpRightIn: "Jump right in",
        findCar: "Find the right car",
        getEstimatedLoanAmount: "Get estimated loan amount",
        iknowCarModel: "Selected car and model",
        inknowLoanAmount: "Loan and down payment amount decided",
        productGroupDescription: {
          AUTOLOANFLL: "Vehicle Loans",
          AUTOMOBILE: "Vehicle Loans"
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
  return new AboutLocale();
});