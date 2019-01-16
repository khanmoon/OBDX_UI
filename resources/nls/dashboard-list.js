define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var DashboardListLocale = function() {
    return {
      root: {
        generic: Generic,
        header: "Design Dashboard",
        alts: {
          viewDashboard: "View Dashboard",
          applyDashboard: "Apply Dashboard",
          dashboardTable: "Dashboard List Table",
          dashboardList: "Dashboard List",
          deleteMapping: "Delete Mapping"
        },
        tableHeaders: {
          dashboardName: "Dashboard Name",
          dashboardDesc: "Dashboard Description",
          dateCreated: "Date Created",
          actions: "Actions",
          role: "Role",
          module: "Module",
          mappedValue: "Mapped Value",
          mappingType: "Mapping Type",
          dashboardId: "Dashboard ID"
        },
        titles: {
          viewTheme: "View Brand",
          applyTheme: "Apply Brand",
          currentTheme: "Current Brand",
          design: "Design",
          mapping: "Mapping"
        },
        entities: {
          USER: "User",
          PARTY: "Party",
          ROLE: "Role",
          BANK: "Entity"
        },
        mappingType: "Mapping Type",
        btns: {
          view: "View",
          apply: "Apply"
        },
        navBarDescription: "Dashboard Design Type"
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
  return new DashboardListLocale();
});