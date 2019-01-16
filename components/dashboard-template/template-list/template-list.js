define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/template-list",
    "./model",
    "framework/js/constants/constants",
    "ojs/ojtable", "ojs/ojknockout", "ojs/ojarraydataprovider",
    "ojs/ojarraytabledatasource", "ojs/ojradioset", "ojs/ojbutton", "ojs/ojlabel"
], function (oj, ko, $, locale, model, Constants) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        params.dashboard.headerName(locale.pageHeader);
        self.resourceBundle = locale;
        self.constants = Constants;
        self.selectSegment = ko.observable();
        params.baseModel.registerElement("action-header");
        self.menuSelection = ko.observable("dashboard");
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.menuOptions = ko.observableArray([{
                "id": "dashboard",
                "label": self.resourceBundle.titles.design
            },
            {
                "id": "mapping",
                "label": self.resourceBundle.titles.mapping
            }
        ]);
        self.dashboardsList = ko.observableArray();
        var allDashboards = [];

        function getDashboardList() {
            model.getDashboardList().done(function (data) {
                self.dashboardsList(data.dashboardDTOs);
                allDashboards = allDashboards.concat(data.dashboardDTOs);
                if (params.rootModel.previousState && params.rootModel.previousState.data && params.rootModel.previousState.data.selectSegment) {
                    self.selectSegment(params.rootModel.previousState.data.selectSegment);
                } else {
                    self.selectSegment("RETAIL");
                }
            });
        }
        self.filter = ko.observable();
        var segmentFilteredData = [];
        self.arrayDataSource = ko.observableArray();
        self.datasource = new ko.observable(new oj.ArrayDataProvider(self.arrayDataSource, {
            idAttribute: "dashboardId",
            implicitSort: [{
                attribute: "dashboardName",
                direction: "descending"
            }]
        }));
        self.selectSegment.subscribe(function (newValue) {
            segmentFilteredData.length = 0;
            for (var i = allDashboards.length - 1; i >= 0; i--) {
                if (newValue.toUpperCase() === allDashboards[i].segment.toUpperCase())
                    segmentFilteredData.push(allDashboards[i]);
            }
            self.arrayDataSource.removeAll();
            self.arrayDataSource([].concat(segmentFilteredData));
            self.datasource(new oj.ArrayDataProvider(self.arrayDataSource(), {
                idAttribute: "dashboardId",
                implicitSort: [{
                    attribute: "dashboardName",
                    direction: "descending"
                }]
            }));
            self.filter(null);
        });
        getDashboardList();

        params.baseModel.registerComponent("dashboard-create", "dashboard-template");
        params.baseModel.registerComponent("image-caption", "dashboard-template");
        params.baseModel.registerComponent("view-dashboard-design", "dashboard-template");
        params.baseModel.registerComponent("select-persona", "dashboard-template");
        params.baseModel.registerComponent("dashboard-mapping", "dashboard-template");
        params.baseModel.registerComponent("dashboard-mapping-list", "dashboard-template");
        params.baseModel.registerElement("page-section");
        params.baseModel.registerElement("nav-bar");
        params.baseModel.registerElement("confirm-screen");
        self.createDashboard = function () {
            params.dashboard.loadComponent("select-persona", {
                "data":{
                    selectSegment:self.selectSegment()
                },
                mode: "create"
            });
        };
        self.viewDashboard = function (data) {
            data.selectSegment = self.selectSegment();
            params.dashboard.loadComponent("view-dashboard-design", {
                data: data
            });
        };
        self.columnArray = [{
                "headerText": self.resourceBundle.tableHeaders.dashboardId,
                "field": "dashboardId"
            },
            {
                "headerText": self.resourceBundle.tableHeaders.dashboardName,
                "field": "dashboardName"
            },
            {
                "headerText": self.resourceBundle.tableHeaders.dashboardDesc,
                "field": "dashboardDesc"
            },
            {
                "headerText": self.resourceBundle.tableHeaders.module,
                "field": "module",
                "template": "moduleName"
            },
            {
                "headerText": self.resourceBundle.tableHeaders.dateCreated,
                "field": "creationDate",
                "template": "formattedDate"
            },
            {
                "headerText": self.resourceBundle.tableHeaders.actions,
                "field": "",
                "template": "theme-actions"
            }
        ];

        self.createTemplateMapping = function () {
            params.dashboard.loadComponent("dashboard-mapping", {
                mode: "create",
                data: {
                    dashboards: self.dashboardsList()
                }
            });
        };

        self.setDefaultDashboard = function (data) {
            model.applyDashboard(data.dashboardId).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr
                }, self);
            });
        };
        self.dashboardMapping = function () {
            params.dashboard.loadComponent("dashboard-mapping-list", {
                mode: "create"
            });
        };

        self.searchDashboards = function () {
            var filteredData = [];
            if (document.getElementById("filter").rawValue && (document.getElementById("filter").rawValue.length > 0)) {
                segmentFilteredData.forEach(function (ele, index) {
                    if (ele.dashboardName.toLowerCase().indexOf(document.getElementById("filter").rawValue.toLowerCase()) >= 0)
                        filteredData.push(segmentFilteredData[index]);
                });
                self.arrayDataSource.removeAll();
                self.arrayDataSource(filteredData);
                self.datasource(new oj.ArrayDataProvider(filteredData, {
                    idAttribute: "dashboardId",
                    implicitSort: [{
                        attribute: "dashboardName",
                        direction: "descending"
                    }]
                }));
            } else {
                self.arrayDataSource.removeAll();
                self.arrayDataSource([].concat(segmentFilteredData));
                self.datasource(new oj.ArrayDataProvider(self.arrayDataSource(), {
                    idAttribute: "dashboardId",
                    implicitSort: [{
                        attribute: "dashboardName",
                        direction: "descending"
                    }]
                }));
            }
        };
    };
});