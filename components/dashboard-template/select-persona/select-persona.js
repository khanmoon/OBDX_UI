define([
    "ojs/ojcore",
    "knockout",
    "jquery", "ojL10n!resources/nls/select-persona",
    "./model", "ojs/ojknockout",
    "base-model"
], function (oj, ko, $, locale, Model) {
    "use strict";

    var vm = function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerElement("page-section");

        params.dashboard.headerName(locale.pageHeader);
        self.nls = locale;
        self.selectSegment = ko.observable();

        self.validationTracker = ko.observable();
        self.personaMap = {
            "RETAIL": {
                "customer": {
                    "name": self.nls.personas.RETAIL.customer,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "loans": {
                    "name": self.nls.personas.RETAIL.loans,
                    "image": ""
                },
                "term-deposits": {
                    "name": self.nls.personas.RETAIL["term-deposits"],
                    "image": ""
                },
                "demand-deposits": {
                    "name": self.nls.personas.RETAIL["demand-deposits"],
                    "image": ""
                },
                "payments": {
                    "name": self.nls.personas.RETAIL.payments,
                    "image": ""
                },
                "trends": {
                    "name": self.nls.personas.RETAIL.trends,
                    "image": ""
                },
                "cards": {
                    "name": self.nls.personas.RETAIL.cards,
                    "image": ""
                },
                "origination": {
                    "name": self.nls.personas.RETAIL.origination,
                    "image": ""
                },
                "application-tracking": {
                    "name": self.nls.personas.RETAIL["application-tracking"],
                    "image": ""
                },
                "account-snapshot": {
                    "name": self.nls.personas.RETAIL["account-snapshot"],
                    "image": ""
                },
                "home": {
                    "name": self.nls.personas.RETAIL.home,
                    "image": ""
                },
                "scan-to-pay": {
                    "name": self.nls.personas.RETAIL["scan-to-pay"],
                    "image": ""
                },
                "payday": {
                    "name": self.nls.personas.RETAIL.payday,
                    "image": ""
                },
                "link-account-dashboard": {
                    "name": self.nls.personas.RETAIL["link-account-dashboard"],
                    "image": ""
                }
            },
            "CORPORATE": {
                approver: {
                    "name": self.nls.personas.CORPORATE.approver,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "account-snapshot": {
                    "name": self.nls.personas.CORPORATE["account-snapshot"],
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "demand-deposits": {
                    "name": self.nls.personas.CORPORATE["demand-deposits"],
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "maker": {
                    "name": self.nls.personas.CORPORATE.maker,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "loans": {
                    "name": self.nls.personas.CORPORATE.loans,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "term-deposits": {
                    "name": self.nls.personas.CORPORATE["term-deposits"],
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "viewer": {
                    "name": self.nls.personas.CORPORATE.viewer,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "corporateadminchecker": {
                    "name": self.nls.personas.CORPORATE.corporateadminchecker,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "corporateadminmaker": {
                    "name": self.nls.personas.CORPORATE.corporateadminmaker,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "checker": {
                    "name": self.nls.personas.CORPORATE.checker,
                    "image": "dashboard-design/personas/dashboard.png"
                }
            },
            "ADMIN":{
                "authadmin": {
                    "name": self.nls.personas.ADMIN.authadmin,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "adminchecker":{
                    "name": self.nls.personas.ADMIN.adminchecker,
                    "image": "dashboard-design/personas/dashboard.png"
                },
                "adminmaker":{
                    "name": self.nls.personas.ADMIN.adminmaker,
                    "image": "dashboard-design/personas/dashboard.png"
                }
            }
        };

        var dashboardType = {
            RETAIL: "retailuser",
            CORPORATE: "corporateuser",
            ADMIN:"administrator"
        };
        self.segmentRoles = ko.observableArray();
        var modules = [];
        var ignoreDashboards=["home","payday","payments","origination","application-tracking","link-account-dashboard"];
        self.personaModules = ko.observableArray();
        self.selectSegment.subscribe(function (newValue) {
            self.personaModules.removeAll();
            self.segmentRoles.removeAll();
            Promise.all([Model.fetchDashboards(dashboardType[newValue]), Model.getSegmentRoles(dashboardType[self.selectSegment()])]).then(function (data) {
                data[0].defaultDashboards.modules.forEach(function (module) {
                    if(ignoreDashboards.indexOf(module.moduleName)===-1){
                        self.personaModules.push({
                            "name": self.personaMap[newValue][module.moduleName].name,
                            "image": self.personaMap[newValue][module.moduleName].image,
                            "module": module.moduleName
                        });
                        modules.push(module.moduleName);
                    }
                });
                data[1].applicationRoleDTOs.forEach(function (role) {
                    if (!(modules.indexOf(role.applicationRoleName.toLowerCase()) >= 0)) {
                        self.segmentRoles.push(role);
                    }
                });
            });
        });
        if (params.rootModel.previousState) {
            self.selectSegment(params.rootModel.previousState.data.segment || "RETAIL");
        } else {
            self.selectSegment("RETAIL");
        }
        var dashboardStructure;
        self.createDashboard = function (module) {
            Model.fetchDashboardDesign(dashboardType[self.selectSegment().toUpperCase()], module).then(function (data) {
                dashboardStructure = data.dashboardDTO.layout;
                params.dashboard.loadComponent("dashboard-create", {
                    mode: "create",
                    data: {
                        module: module,
                        segment: self.selectSegment()
                    },
                    dashboardStructure: dashboardStructure
                });
            });

        };
        self.createRoleDashboard = function (module, moduleNameToDisplay) {
            params.dashboard.loadComponent("dashboard-create", {
                mode: "create",
                data: {
                    module: module,
                    moduleNameToDisplay: moduleNameToDisplay,
                    segment: self.selectSegment()
                }
            });
        };
    };
    return vm;
});