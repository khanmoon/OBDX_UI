define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {

        fundingTable: "Funding Table",
        propertyPurchacePrice: "Property Purchase Price",
        legalCosts: "Legal Costs (if any)",
        totalFees: "Total Fees",
        lendersMortgageInsurance: "Lenders Mortgage Insurance",
        editPrice: "Edit Price",
        editPriceTitle: "Icon to edit price",
        savePrice: "Save Price",
        savePriceTitle: "Icon to save price",
        totalCosts: "Total Costs",
        requestedLoanAmount: "Requested Loan Amount",
        yourContribution: "Your Contribution",
        totalFeeDetailClick: "Total fees detail",
        totalFeeDetailTitle: "Total fees detail tooltip",
        totalFeesTooltip: "{feeType1}: {fee1}",
        okWithContribution: "Are you okay with this contribution?",
        estValue: "Estimated value of vehicle",
        bankFees: {
          MortgRegistrationfee: "Registration Fee",
          MortgStampduty: "Stamp Duty",
          MortgageSolicitorFees: "Solicitor Fees"
        },
        submitFundingTable: "Click here to Submit Funding information",
        messages: {},

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