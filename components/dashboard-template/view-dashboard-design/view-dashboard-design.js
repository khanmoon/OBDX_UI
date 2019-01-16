define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/view-dashboard-design",
  "./model", "ojs/ojnavigationlist"
], function (ko, $, locale, model) {
  "use strict";

  var temp = {
    "name": null,
    "layout": {
      "large": {
        "topPanel": []
      },
      "medium": {
        "topPanel": []
      },
      "small": {
        "topPanel": []
      }
    }
  };

  var vm = function (params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.resourceBundle = locale;
    params.dashboard.headerName(self.resourceBundle.pageHeader);
    params.baseModel.registerElement("page-section");
    params.baseModel.registerElement("confirm-screen");
    params.baseModel.registerComponent("dashboard-create", "dashboard-template");
    params.baseModel.registerElement("modal-window");
    self.dashboardDesign = ko.observable(self.params.data);
    self.showDesktopView = ko.observable(true);
    self.showTabView = ko.observable(false);
    self.showMobileView = ko.observable(false);
    temp.name = self.dashboardDesign().module;

    function registerDashboardComponents(layoutType) {
      self.dashboardDesign().layout.dashboardLayout[layoutType].forEach(function (component) {
        if (component.childPanel.length) {
          component.childPanel.forEach(function (subcomponent) {
            params.baseModel.registerComponent(subcomponent.componentName, "widgets/" + subcomponent.module);
            if (typeof subcomponent.data === "string") {
              subcomponent.data = JSON.parse(subcomponent.data);
            }
          });
        } else {
          params.baseModel.registerComponent(component.componentName, "widgets/" + component.module);
          if (typeof component.data === "string") {
            component.data = JSON.parse(component.data);
          }
        }
      });
    }
    registerDashboardComponents("large");
    registerDashboardComponents("medium");
    registerDashboardComponents("small");

    self.deleteDashboard = function () {
      model.deleteDesignDashboard(self.dashboardDesign().dashboardId).done(function (data, status, jqXhr) {
        params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr
        }, self);
      });
    };
    self.confirmDelete = function () {
      $("#deleteDialog").trigger("openModal");
    };
    self.closeDeleteDialog = function () {
      $("#deleteDialog").hide();
    };
    var currentView;
    self.startRendering = ko.observable(true);
    self.viewType = ko.observable("desktop");
    self.viewType.subscribe(function (newValue) {
      self.showDesktopView(false);
      self.showTabView(false);
      self.showMobileView(false);
      if (newValue === "desktop") {
        self.showDesktopView(true);
        currentView="stp1";
      } else if (newValue === "tab") {
        self.showTabView(true);
        currentView="stp3";
      } else if (newValue === "mobile") {
        self.showMobileView(true);
        currentView="stp4";
      }
    });
    self.editDashboard = function () {
      params.dashboard.loadComponent("dashboard-create", {
        mode: "edit",
        data: self.dashboardDesign(),
        currentView:currentView
      });
    };
    var focusableElementsString = "input:not([disabled]), a[href], area[href], select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex=\"0\"], [contenteditable]";
    $(document).on("keydown", "#viewDashboard", function (e) {
      if (e.keyCode === 9) {
        setTimeout(function () {
          var modal;
          if(self.showDesktopView()){
            modal = document.getElementById("desktop-review-container");
          }else if(self.showTabView()){
            modal = document.getElementById("tab-review-container");
          }else if(self.showMobileView()){
            modal = document.getElementById("mobile-review-container");
          }
          var focusableElements = modal.querySelectorAll(focusableElementsString);
          focusableElements = Array.prototype.slice.call(focusableElements);
          var firstTabStop = focusableElements[0];
          var lastTabStop = focusableElements[focusableElements.length - 1];
          if (document.activeElement === firstTabStop) {
            document.getElementById("editCurrentDashboard").focus();
          } else if (document.activeElement === lastTabStop) {
            document.getElementById("dashboardSwitchView").focus();
          }
        }, 200);
      }
    });
  };
  return vm;
});