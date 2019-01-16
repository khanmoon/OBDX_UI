define(["ojL10n!resources/nls/generic","ojL10n!resources/nls/obdx-module-list"], function (Generic,ModuleList) {
  "use strict";
  var SelectPersonaLocale = function () {
    return {
      root: {
        generic: Generic,
        selectUser: "Select User",
        selectModule: "Select Module",
        segments: {
          retail: "Retail",
          corporate: "Corporate",
          admin: "Admin"
        },
        personas: ModuleList,
        dashboard: "Dashboard",
        dashboardType: {
          factoryShipped: "Factory Shipped",
          customised: "Customised"
        },
        pageHeader: "Dashboard Builder"
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
  return new SelectPersonaLocale();
});