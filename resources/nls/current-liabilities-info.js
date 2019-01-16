define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {

        liability: "Liability {index}",
        primaryLiability: "Primary Liability",
        additionalLiability: "Additional Liability",
        addLiability: "Add a Liability",
        addAnotherLiability: "Add another Liability",
        liabilityType: "Type of Liability",
        liabilityValue: "Original Value (Currency)",
        outstandingValue: "Outstanding Value (Currency)",
        ownership: "Share of Liability (%)",
        deleteLiabilityOnClick: "Deleting the Liability",
        deleteLiabilityOnClickTitle: "Click For Deleting the Liability",
        editLiabilityOnClick: "Click For Edit Liability",
        addLiabilityOnClick: "Click For Added the Liability",
        addAnotherLiabilityOnClick: "Click For Adding Another Liability",
        coAppFillDetails: "Let the co-applicant fill his details",
        frequency: "Frequency",
        messages: {
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}",
          liabilityValue: "Outstanding value entered cannot be greater than original",
          liablilityType: "Please select a valid liability type",
          ownershipLiability: "Please provide a valid share of liability %"
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
  return new orientationLocale();
});