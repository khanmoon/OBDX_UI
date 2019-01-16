define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        bbdpb: "Big billion day payback",
        iphone: "Item 6234"
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
  return new TransactionLocale();
});