define([], function() {
  "use strict";
  var AmendmentsLocale = function() {
    return {
      root: {
        amendmentDetailsHeader: "Amendment No {amendmentNumber}",
        newAmount: "New Guarantee Amount",
        lcRefNumber: "LC Reference Number",
        amendmentNumber: "Amendment Number",
        amendTable: "Amendment Table",
        newExpiryDate: "Expiry Date(New)",
        dateOfIssue: "Date of Issue",
        dateOfAmendment: "Date of Amendment",
        additionalAmountCovered: "Additional Amount Covered",
        narrative: "Narrative",
        newLcAmount: "New LC Amount",
        amendButton: "Amend"
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
  return new AmendmentsLocale();
});