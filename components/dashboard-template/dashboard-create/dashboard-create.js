define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/dashboard-create",
    "framework/js/constants/constants",
    "./model",
    "ojs/ojknockout", "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation"
], function (oj, ko, $, locale, Constants, model) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resourceBundle = locale;
        self.constants = Constants;

        self.dashboardStructure = params.rootModel.params.dashboardStructure ? params.rootModel.params.dashboardStructure : null;
        var autoRendered = params.rootModel.previousState ? params.rootModel.previousState.data.autoRendered : false;
        self.desktopTemplate = params.rootModel.previousState ? params.rootModel.previousState.data.desktop : ko.observableArray();
        self.tabTemplate = params.rootModel.previousState ? params.rootModel.previousState.data.tab : ko.observableArray();
        self.mobileTemplate = params.rootModel.previousState ? params.rootModel.previousState.data.mobile : ko.observableArray();

        self.desktopEdit = params.rootModel.previousState ? params.rootModel.previousState.data.editState.desktop : ko.observable(false);
        self.tabEdit = params.rootModel.previousState ? params.rootModel.previousState.data.editState.tab : ko.observable(false);
        self.mobileEdit = params.rootModel.previousState ? params.rootModel.previousState.data.editState.mobile : ko.observable(false);

        self.selected = ko.observable(params.rootModel.previousState ? params.rootModel.previousState.data.params.currentEdit : "stp1");
        if(!params.rootModel.previousState){
            if(self.params.currentView){
                self.selected(self.params.currentView);
            }
        }
        var currentView=self.selected();

        self.validationTracker = ko.observable();
        self.moduleComponentsDesktop = ko.observableArray();
        self.moduleComponentsTab = ko.observableArray();
        self.moduleComponentsMobile = ko.observableArray();
        self.designLayouts = ko.observable();
        params.baseModel.registerComponent("desktop-layout", "dashboard-template");
        params.baseModel.registerComponent("tab-layout", "dashboard-template");
        params.baseModel.registerComponent("mobile-layout", "dashboard-template");
        params.baseModel.registerComponent("preview-dashboard-design", "dashboard-template");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerElement("page-section");

        var getTargetLinkageModel = function () {
            var KoModel = model.getTargetLinkageModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.dashboardDesign = ko.observable(getTargetLinkageModel());
        self.dashboardDesign().segment([self.params.data.segment]);
        self.dashboardDesign().module([self.params.data.module]);
        self.moduleNameToDisplay=self.params.data.moduleNameToDisplay||null;
        var dashboardId = self.params.data.dashboardId || null;
        var userName = self.params.data.userName || null;
        self.dashboardDesign().dashboardName(params.rootModel.previousState ? params.rootModel.previousState.data.dashboardName : null);
        self.dashboardDesign().dashboardDesc(params.rootModel.previousState ? params.rootModel.previousState.data.dashboardDesc : null);

        /**
         * The model function called to set Widget Controls
         * @param  {Object} data The data to intialize the control
         * @function widgetListControl
         * @returns {void}
         */
        function widgetListControl(data) {
            var self = this;
            self.height = data.height ? data.height : "";
            self.icon = data.icon ? data.icon : "";
            self.componentName = data.componentName ? data.componentName : "";
            self.module = data.module ? data.module : "";
            self.width = data.width ? data.width : "";
            self.segment = data.segment ? data.segment : "";
            self.input = data.input ? data.input : {};
        }

        self.componentListFetch=function(){
            return new Promise(function(resolve){
                require(["json!design-dashboard/moduleComponents"], function (data) {
                    $(data.components).each(function (index, val) {
                        if (val.isVisible && val.isWidget && ($.inArray(self.dashboardDesign().segment()[0].toUpperCase(), val.segment) >= 0)) {
                            self.moduleComponentsDesktop.push(new widgetListControl(val));
                            self.moduleComponentsTab.push(new widgetListControl(val));
                            self.moduleComponentsMobile.push(new widgetListControl(val));
                        }
                    });
                    resolve();
                });
            });
        };
        self.componentListPromise=self.componentListFetch();
        self.refreshDropdown = ko.observable(true);
        self.moduleList = ko.observableArray();

        if (self.params.mode === "edit") {
            self.dashboardDesign().dashboardName(self.params.data.dashboardName);
            self.dashboardDesign().dashboardDesc(self.params.data.dashboardDesc);
            if (self.constants.userSegment === "ADMIN") {
                self.dashboardDesign().segment([self.params.data.segment]);
                self.dashboardDesign().module([self.params.data.module]);
            } else {
                self.dashboardDesign().module(self.params.data.module);
            }
            self.dashboardDesign().userName(self.params.data.userName);
        }
        self.layoutSelected = function (vm, event) {
            $(event.currentTarget).toggleClass("selectedLayout");
            $(event.currentTarget).prevAll().removeClass("selectedLayout");
            $(event.currentTarget).nextAll().removeClass("selectedLayout");
        };
        self.desktopPromise=new Promise(function(resolve){
            self.desktopPromiseReference=resolve;
        });
        self.tabPromise=new Promise(function(resolve){
            self.tabPromiseReference=resolve;
        });
        self.mobilePromise=new Promise(function(resolve){
            self.mobilePromiseReference=resolve;
        });


        self.previewDashboardDesign = function () {
            if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
                return;
            }
            document.getElementsByTagName("body")[0].classList.add("page-is-changing");
            if (!autoRendered) {
                if(self.selected()==="stp4"){
                    self.selected("stp1");
                    self.desktopPromise.then(function(){
                        self.selected("stp3");
                    });
                }else if(self.selected()==="stp3"){
                    self.selected("stp1");
                    self.desktopPromise.then(function(){
                        self.selected("stp4");
                    });
                }else if(self.selected()==="stp1"){
                    self.selected("stp3");
                    self.tabPromise.then(function(){
                        self.selected("stp4");
                    });
                }
                Promise.all([self.desktopPromise,self.tabPromise,self.mobilePromise]).then(function(){
                    autoRendered = true;
                    $("#design-steps-container").hide();
                    params.dashboard.loadComponent("preview-dashboard-design", {
                        "data": {
                            "desktop": self.desktopTemplate,
                            "tab": self.tabTemplate,
                            "mobile": self.mobileTemplate,
                            "dashboardName": self.dashboardDesign().dashboardName(),
                            "dashboardDesc": self.dashboardDesign().dashboardDesc(),
                            params: params.rootModel.params.data,
                            autoRendered: autoRendered,
                            dashboardId: dashboardId,
                            userName: userName,
                            editState: {
                                desktop: self.desktopEdit,
                                tab: self.tabEdit,
                                mobile: self.mobileEdit
                            },
                            currentView:currentView
                        },
                        "mode": self.params.mode
                    });
                });
            } else {
                params.dashboard.loadComponent("preview-dashboard-design", {
                    "data": {
                        "desktop": self.desktopTemplate,
                        "tab": self.tabTemplate,
                        "mobile": self.mobileTemplate,
                        "dashboardName": self.dashboardDesign().dashboardName(),
                        "dashboardDesc": self.dashboardDesign().dashboardDesc(),
                        params: params.rootModel.params.data,
                        autoRendered: autoRendered,
                        dashboardId: dashboardId,
                        userName: userName,
                        editState: {
                            desktop: self.desktopEdit,
                            tab: self.tabEdit,
                            mobile: self.mobileEdit
                        },
                        currentView:currentView
                    },
                    "mode": self.params.mode
                });
            }
        };
        params.dashboard.headerName(locale.header);
    };
});