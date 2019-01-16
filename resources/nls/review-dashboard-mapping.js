define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var ReviewDashboardMappingLocale = function() {
    return {
      root: {
        generic: Generic,
        pageHeader:"Review Dashboard Mapping",
        header: "Dashboard Mapping",
        labels:{
          mappingType:"Mapping Type",
          mappingValue:"Mapping Value",
          template:"Template"
        },
        mappingType:{
          USER:"User",
          PARTY:"Party",
          ROLE:"Role"
        },
        reviewMapping:"Review dashboard mapping before you confirm!"
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
  return new ReviewDashboardMappingLocale();
});
