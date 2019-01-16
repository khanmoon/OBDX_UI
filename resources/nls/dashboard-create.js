define(["ojL10n!resources/nls/generic","ojL10n!resources/nls/obdx-module-list"], function(Generic,ModuleList) {
  "use strict";
  var DashboardCreateLocale = function() {
    return {
      root: {
        header: "Dashboard Builder",
        designSave: "New Dashboard Design",
        labels: {
          description: "Description",
          name: "Dashboard Name",
          templateName:"Template Name",
          role: "Role",
          module: "Module",
          segment: "Segment",
          selectRole: "Select Role",
          selectModule: "Select Module",
          selectSegment: "Select Segment",
          dashboardDesc: "Dashboard Description",
          tabLayout: "Tab Layout",
          deleteMe: "Delete Me",
          add: "Add",
          addRow: "Add Row",
          gridChoice: "Select Grid Type For Row",
          noOfGrids: "Number of Grids",
          indivisualGridSize: "Enter Column Size for each Grid",
          createMsg:"Customise your Dashboards for your Users.",
          userType:"User Type",
          segments: {
            admin: "Admin",
            retail: "Retail",
            corporate: "Corporate"
          },
          contextMenu: {
            oneXone: "1x1",
            oneXtwo: "1x2",
            oneXthree: "1x3",
            oneXfour: "1x4",
            oneXfive: "1x5",
            customGrid: "Custom Grid",
            removeMe: "Remove Me"
          }
        },
        errorMsg: "Invalid Grid Size",
        titleInfo:"Column size is {width}",
        componentInput:"Component Input",
        errorMsg2: "Addition of all grid columns should not go beyond 12 columns",
        errorMsg3: "Grid size can not be empty",
        addRowInfo:"To add columns, right click > select columns",
        invalidTemplateName:"Enter valid name for template",
        watchTutVid:"Watch Tutorial Video",
        TutVid:"Tutorial Video",
        compoSearch:"Search Component",
        generic: Generic,
        moduleList:ModuleList
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new DashboardCreateLocale();
});