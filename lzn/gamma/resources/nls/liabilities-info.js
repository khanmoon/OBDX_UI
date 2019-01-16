define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {
        compName: "liabilities-info",
        liability: "Liability {index}",
        primaryLiability: "Primary Liability",
        additionalLiability: "Additional Liability",
        addLiability: "Add a Liability",
        addAnotherLiability: "Add another Liability",
        liabilityType: "Type of Liability",
        liabilityValue: "Original Value",
        outstandingValue: "Outstanding Value",
        ownership: "Share of Liability (%)",
        coAppFillDetails: "Let the co-applicant fill his details",
        frequency: "Frequency",
        allLiabilities: "Liabilities",
        deleteLiabilityClick: "Click For Delete Liability",
        editLiabilityClick: "Click For Edit  Liability",
        addLiabilityClick: "Click For Added Liability",
        addAnotherLiabilityClick: "Click For Added Another Liability",
        noLiabilities: "No Liabilities Added",
        messages: {
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}",
          liabilityValue: "Outstanding value entered cannot be greater than original",
          liablilityType: "Please select a valid liability type",
          ownershipLiability: "Please provide a valid share of liability %"
        },

        generic: Generic
      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new orientationLocale();
});