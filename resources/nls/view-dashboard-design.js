define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ViewDashboardDesignLocale = function() {
    return {
      root: {
        generic: Generic,
        pageHeader: "Dashboard Builder",
        designDelete: "Dashboard Template",
        ques1: "Deletion of a template will result in deleting the respective template mapping. Are you sure you want to delete this template?",
        labels: {
          description: "Description",
          name: "Dashboard Name",
          role: "Role",
          module: "Module",
          topPanel: "Top Panel",
          leftPanel: "Left Panel",
          middlePanel: "Middle Panel",
          rightPanel: "Right Panel",
          selectRole: "Select Role",
          selectModule: "Select Module",
          previous: "Previous",
          desktopDesign: "Desktop",
          tabDesign: "Tab",
          mobileDesign: "Mobile",
          reviewDesign: "Review Design"
        },
        reviewDashboard: "Review dashboard before you confirm!",
        switchView: "Switch View"
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
  return new ViewDashboardDesignLocale();
});
