define([], function() {
  "use strict";
  var pageBannerLocale = function() {
    return {
      root: {
        pageBanner: {
          labels: {
            banking: "Banking<span>.</span>Unprecedented<span>.</span>",
            assurance: "Your financial security guaranteed.",
            login: "Login"
          }
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
  return new pageBannerLocale();
});