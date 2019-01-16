define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ChequeStopUnblock = function() {
    return {
      root: {
        chequeDetails: {
          chequeDetails: "Give Cheque Details",
          number: "Number",
          range: "Range",
          chequeNumber: "Cheque Number",
          from: "From",
          to: "To"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ChequeStopUnblock();
});