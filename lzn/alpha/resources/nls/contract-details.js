define([], function() {
  "use strict";
  var ContractDetailsLocale = function() {
    return {
      root: {
        labels: {
          condition: "Condition",
          description: "Description",
          contractsRequired: "Contracts Required",
          tableHeader: "Select at least one condition to proceed"
        },
        errors: {
          invalidContractDesc: "Enter valid contract desc"
        }
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
  return new ContractDetailsLocale();
});