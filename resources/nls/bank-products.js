define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var BankProducts = function() {
    return {
      root: {
        alt: {
          productName: "Goto {productName}",
          productImage: "{productName} Logo"
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
  return new BankProducts();
});