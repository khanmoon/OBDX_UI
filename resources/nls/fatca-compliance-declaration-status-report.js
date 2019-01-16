define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var FatcaComplianceDeclarationstatusLocale = function() {
    return {
      root: {
        fatca: {
          generate: "Generate By",
          partyId: "Party ID",
          status: "Status",
          partyIdSelect: "Enter Party ID",
          statusSelect: "Status",
          duration: "Duration",
          fromDate: "From",
          toDate:"To",
          selectStatus: "Select Status"
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
  return new FatcaComplianceDeclarationstatusLocale();
});
