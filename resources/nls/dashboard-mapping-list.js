define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";
  var DashboardMappingList = function () {
    return {
      root: {
        generic: Generic,
        alts: {
          viewDashboard: "View Dashboard",
          applyDashboard: "Apply Dashboard",
          dashboardTable: "Dashboard List Table",
          dashboardList: "Dashboard List",
          deleteMapping: "Delete Mapping",
          dashboardMapping: "Dashboard Mapping"
        },
        entities: {
          USER: "User",
          PARTY: "Party",
          ROLE: "Role",
          BANK: "Entity"
        },
        selectMapping: "Select Mapping",
        labels: {
          mappingType: "Mapping Type",
          mappingValue: "Mapping Value",
          module: "Module",
          dashboard: "Dashboards"
        },
        selectDashboard: "Select dashboard",
        tableHeaders: {
          dashboardName: "Dashboard Name",
          dashboardDesc: "Dashboard Description",
          dateCreated: "Date Created",
          actions: "Actions",
          role: "Role",
          module: "Module",
          mappedValue: "Mapped Value",
          mappingType: "Mapping Type",
          dashboardId: "Dashboard ID",
          templateId:"Template ID"
        },
        mappingType: "Mapping Type",
        header: "Mapping your templates",
        createDescription: "One dashboard template can be linked to multiple User, Party, Role or Entity. Click  below to start mapping your templates.",
        createMapping: "Create Mapping",
        pageHeader: "Dashboard Builder",
        ques1:"Are you sure you want to Delete?"
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
  return new DashboardMappingList();
});