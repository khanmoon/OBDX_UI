define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {
        cardTitle: "Account Configuration",
        fixedTerm: "Fixed rate for the initial period",
        fixedTermDuration: "Fixed Rate Term",
        variableTermDuration: "Variable Term Duration",
        wantIOI: "Pay only interest for the initial period",
        enterIOITerm: "Interest Only Term",
        enterIOIFrequency: "Interest Only Repayment Frequency",
        enterEIPITerm: "Enter the EIPI Term",
        enterEIPIFrequency: "Principal and Interest Repayment Frequency",
        frequencyForStatement: "Statement Frequency",
        availRedrawFacility: "Avail Redraw Facility",
        statementRequired: "Statement Required",
        messages: {
          fixedTermDuration: "Please enter fixed term duration",
          IOITermDuration: "Please enter IOI term duration",
          EIPITermDuration: "Please enter EIPI term duration",
          frequency: "Please enter frequency"
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