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
        liabilityLabel: "Liability",
        liabilityValue: "Original Value",
        outstandingValue: "Outstanding Value",
        repaymentFrequency: "Repayment Frequency",
        totalAmount: "Total Amount",
        dueAmount: "Balance Due",
        ownership: "Share of Liability (%)",
        coAppFillDetails: "Let the co-applicant fill his details",
        frequency: "Frequency",
        allLiabilities: "Liabilities",
        deleteLiabilityClick: "Delete Liability",
        deleteLiabilityClickTitle: "Click For Delete Liability",
        editLiabilityClick: "Click For Edit  Liability",
        addLiabilityClick: "Click For Added Liability",
        addAnotherLiabilityClick: "Click For Added Another Liability",
        noLiabilities: "No Liabilities Added",
        liabilityInfoDisclaimer1: "Identify all your debts that you are currently servicing.",
        limitExceeded: "You can only add upto {limit} liability records.",
        messages: {
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}",
          liabilityValue: "Outstanding value entered cannot be greater than original",
          liablilityType: "Please select a valid liability type",
          totalAmount: "Balance due cannot be greater than the total amount.",
          ownershipLiability: "Please provide a valid share of liability %",
          repaymentFrequency: "Please select a valid repayment frequency type"
        },
        submitLiabilities: "Click here to Submit Liabilities Information",
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
