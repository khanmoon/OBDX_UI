define([], function() {
  "use strict";
  var AmountInputLocale = function() {
    return {
      root: {
        currencyValidation: "Invalid Currency",
        amountValidation: "Please enter a valid amount",
        minAmountValidation: "Please enter more than minimum amount",
        maxAmountValidation: "Please enter less than maximum amount",
        currency: "Currency"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new AmountInputLocale();
});