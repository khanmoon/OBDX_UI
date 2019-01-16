define(["ojL10n!resources/nls/generic"], function(Messages, Generic) {
  "use strict";
  var IndexLocale = function() {
    return {
      root: {
        pageTitle: {
          index: "ZigBank : Digital Experience"
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
  return new IndexLocale();
});