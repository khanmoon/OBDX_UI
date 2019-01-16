define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var dashboardLocale = function() {
    return {
      root: {
        messages: {
          feeAction: "Please specify Action",
          accountNumber: "Please enter an  account number"
        },

        applicationTreatment: "How should the application fee be treated ?",
        summary: "Summary",
        feeSuummary: "Fee Summary",
        payFromAccount: "Pay from this Account",
        continue: "Continue",

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
  return new dashboardLocale();
});