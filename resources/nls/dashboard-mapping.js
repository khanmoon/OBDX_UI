define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var DashboardMappingLocale = function() {
    return {
      root: {
        generic: Generic,
        labels: {
          mappingType: "Mapping Type",
          selectRole:"Select Role",
          mappingValue: "Mapping Value",
          module: "Module",
          dashboard: "Dashboards",
          template:"Template",
          selectedParty:"{name} ({partyid})"
        },
        heading: {
          create: "Create Mapping"
        },
        header2:"Mapping your templates",
        mapingDesc:"One dashboard template can be linked to multiple User, Party, Role or Entity.",
        entities: {
          USER: "User",
          PARTY: "Party",
          ROLE: "Role",
          BANK: "Entity"
        },
        searchParty:"Party Search",
        selectMapping: "Select Mapping",
        selectRole:"Select Role",
        selectBrand: "Select Brand",
        dashboardList: "{dashboardId} {dashboardName}",
        noTemplate:"No dashboard templates available currently. Do you want to design new template?",
        userWarning:"Invalid User",
        mappingValueWarning:"Enter Mapping Value"
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
  return new DashboardMappingLocale();
});