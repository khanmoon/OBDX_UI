define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var FatcaComplianceDeclarationLocale = function() {
    return {
      root: {
        fatca: {
          generate: "Generate By",
          partyId: "Party ID",
          formType: "Form Type",
          partyIdSelect: "Enter Party ID",
          formTypeSelect: "Select Form Type",
          duration: "Duration",
          fromDate: "From",
          toDate:"To"
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
  return new FatcaComplianceDeclarationLocale();
});
