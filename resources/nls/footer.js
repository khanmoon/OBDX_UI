define([], function() {
  "use strict";
  var FooterLocale = function() {
    return {
      root: {
        copyright: "Copyright © 2006, 2017, Oracle and/or its affiliates. All rights reserved.",
        securityInfo: "Security Information",
        security: "Security",
        info: "Information",
        tnc: "Terms and Conditions"

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
  return new FooterLocale();
});