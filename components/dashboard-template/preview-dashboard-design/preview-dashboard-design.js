define([
  "ojs/ojcore",
  "knockout",
  "jquery", "ojL10n!resources/nls/view-dashboard-design",
  "./model", "framework/js/constants/constants", "ojs/ojnavigationlist", "ojs/ojknockout",
  "base-model"
], function (oj, ko, $, locale, model) {
  "use strict";

  var vm = function (params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = locale;
    params.rootModel.params.data.params.currentEdit = "stp1";
    params.dashboard.headerName(self.nls.pageHeader);
    self.showDesktopView = ko.observable(false);
    self.showTabView = ko.observable(false);
    self.showMobileView = ko.observable(false);
    self.viewType = ko.observable();
    if(params.rootModel.params.data.currentView==="stp1"){
      self.showDesktopView(true);
      self.viewType("desktop");
    }else if(params.rootModel.params.data.currentView==="stp3"){
      self.showTabView(true);
      self.viewType("tab");
    }else if(params.rootModel.params.data.currentView==="stp4"){
      self.showMobileView(true);
      self.viewType("mobile");
    }
    $(document).on("click", "#stp1,#stp3,#stp4", function () {
      params.rootModel.params.data.params.currentEdit = $(this).attr("id");
      params.dashboard.hideDetails();
    });

    self.viewType.subscribe(function (newValue) {
      self.showDesktopView(false);
      self.showTabView(false);
      self.showMobileView(false);
      if (newValue === "desktop") {
        self.showDesktopView(true);
      } else if (newValue === "tab") {
        self.showTabView(true);
      } else if (newValue === "mobile") {
        self.showMobileView(true);
      }
    });
    self.saveDashboardDesign = function () {
      var payload = {
        "dashboardName": params.rootModel.params.data.dashboardName,
        "dashboardDesc": params.rootModel.params.data.dashboardDesc,
        "module": params.rootModel.params.data.params.module,
        "segment": params.rootModel.params.data.params.segment,
        "layout": {
          "name": "",
          "titleName": "",
          "landingKey": params.rootModel.params.data.params.module
        }
      };
      var tempDesktop = ko.mapping.toJS(params.rootModel.params.data.desktop());
      var tempTab = ko.mapping.toJS(params.rootModel.params.data.tab());
      var tempMobile = ko.mapping.toJS(params.rootModel.params.data.mobile());
      payload.layout.dashboardLayout = {
        "large": [],
        "medium": [],
        "small": []
      };

      /**
       * The function is called to set the payload model
       * @param  {Object} source The data from where input values are extracted.
       * @param  {String} target It spefies target layout.
       * @function designLayout
       * @returns {void}
       */
      function designLayout(source, target) {
        source.forEach(function (item) {
          item.rowComponents.forEach(function (component) {
            var designComponent = {};
            designComponent.style = component.customGrids;
            if (component.myComponents.length === 1) {
              designComponent.componentName = component.myComponents[0].componentName;
              designComponent.module = component.myComponents[0].module;
              designComponent.data = JSON.stringify(component.myComponents[0].data);
              payload.layout.dashboardLayout[target].push(designComponent);
            } else {
              designComponent.childPanel = [];
              component.myComponents.forEach(function (subComponent) {
                var subDesignComponent = {};
                subDesignComponent.componentName = subComponent.componentName;
                subDesignComponent.module = subComponent.module;
                subDesignComponent.data = JSON.stringify(subComponent.data);
                designComponent.childPanel.push(subDesignComponent);
              });
              if (designComponent.childPanel.length) {
                payload.layout.dashboardLayout[target].push(designComponent);
              }
            }
          });
        });
      }
      /**
       * The function is called to set the payload model for mobile
       * @param  {Object} source The data from where input values are extracted.
       * @function designLayout
       * @returns {void}
       */
      function designMobileLayout(source) {
        source[0].rowComponents.forEach(function (item) {
          item.myComponents.forEach(function (component) {
            payload.layout.dashboardLayout.small.push({
              "componentName": component.componentName,
              "module": component.module,
              "style": "oj-sm-12",
              "data": JSON.stringify(component.data)
            });
          });
        });
      }
      designLayout(tempDesktop, "large");
      designLayout(tempTab, "medium");
      designMobileLayout(tempMobile);
      if (self.params.mode !== "edit") {
        delete payload.userName;
        delete payload.dashboardDesign;
        model.saveDashboard(ko.toJSON(ko.mapping.toJS(payload))).done(function (data, status, jqXhr) {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.pageHeader
          }, self);
        });
      } else if (self.params.mode && self.params.mode === "edit") {
        delete payload.userName;
        payload.creationDate = params.rootModel.params.data.params.creationDate;
        model.updateDashboard(ko.toJSON(ko.mapping.toJS(payload)), params.rootModel.params.data.dashboardId).done(function (data, status, jqXhr) {
          params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.pageHeader
          }, self);
        });
      }
    };

    self.reviewTransactionName = {};
    self.reviewTransactionName.header = self.nls.generic.common.review;
    self.reviewTransactionName.reviewHeader = self.nls.reviewDashboard;
    var focusableElementsString = "input:not([disabled]), a[href], area[href], select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex=\"0\"], [contenteditable]";
    $(document).on("keydown", "#preViewDashboardDesign", function (e) {
      if (e.keyCode === 9) {
        setTimeout(function () {
          var modal;
          if (self.showDesktopView()) {
            modal = document.getElementById("desktop-review-container");
          } else if (self.showTabView()) {
            modal = document.getElementById("tab-review-container");
          } else if (self.showMobileView()) {
            modal = document.getElementById("mobile-review-container");
          }
          var focusableElements = modal.querySelectorAll(focusableElementsString);
          focusableElements = Array.prototype.slice.call(focusableElements);
          var firstTabStop = focusableElements[0];
          var lastTabStop = focusableElements[focusableElements.length - 1];
          if (document.activeElement === firstTabStop) {
            $(".frame-contents").parent().next().find("a").focus();
          } else if (document.activeElement === lastTabStop) {
            document.getElementById("dashboardSwitchView").focus();
          }
        }, 200);
      }
    });
  };
  return vm;
});