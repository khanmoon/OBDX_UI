define(["ojL10n!resources/nls/generic"], function(Messages, Generic) {
  "use strict";
  var MakerLocale = function() {
    return {
      root: {
        pageTitle: {
          maker: "Maker"
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
  return new MakerLocale();
});