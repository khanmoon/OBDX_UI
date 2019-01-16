define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Origination) {
  "use strict";
  var AMLLocale = function() {
    return {
      root: {
        submitAdditionalInfo: "Click here to submit additional info",
        sourceOfWealth: "Source of Wealth",
        sourceOfFund: "Source of Funds",
        purposeOfRelationship: "Purpose of Relationship	",
        consents: "Consents",
        origination: Origination
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
  return new AMLLocale();
});
