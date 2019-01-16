define([], function() {
  "use strict";
  var AboutLocale = function() {
    return {
      root: {
        header: "About",
        productShortName: "OBDX",
        productName: "Oracle Banking Digital Experience",
        version: "Version",
        servicePack: "Service Pack",
        poweredBy: "Powered By",
        poweredByValue: "Oracle",
        copyright: "Copyright 1995-2017, Oracle and/or its affiliates. All right reserved.",
        build: "Build"

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
  return new AboutLocale();
});