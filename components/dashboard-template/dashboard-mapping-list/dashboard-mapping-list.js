define([
    "ojs/ojcore",
    "knockout",
    "jquery", "ojL10n!resources/nls/dashboard-mapping-list",
    "./model", "ojs/ojtable", "ojs/ojknockout", "ojs/ojarraytabledatasource",
    "base-model"
], function (oj, ko, $, locale, model) {
    "use strict";

    var vm = function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerElement("page-section");

        params.baseModel.registerElement("modal-window");
        self.resourceBundle = locale;
        self.showMapping = ko.observable();
        self.entities = ko.observableArray();
        require(["json!entities"], function (data) {
            self.entities(data.dashboardData);
        });
        self.mappingDataSource = ko.observableArray();
        self.mappingList = new oj.ArrayTableDataSource(self.mappingDataSource, {
            idAttribute: "id"
        });
        /**
         * The model function called to fetch the dashboard mappings
         * @param  {Object} type The type of mappings of dashboard to get
         * @function getMappings
         * @returns {void}
         */
        function getMappings(type) {
            if (type.length) {
                model.getMappings(type).done(function (data) {
                    self.mappingDataSource.removeAll();
                    ko.utils.arrayPushAll(self.mappingDataSource, params.baseModel.sortLib(data.dashboardDTOs, "creationDate", "desc").map(function (item) {
                        item.id = item.mappedType + item.mappedValue;
                        return item;
                    }));
                    self.showMapping(true);
                });
            } else {
                self.showMapping(false);
            }
        }
        self.mappingType = ko.observable();
        self.mappingType.subscribe(function (type) {
            self.mappingDataSource.removeAll();
            getMappings(type);
        });
        self.mappingType(["USER"]);
        self.createTemplateMapping = function () {
            params.dashboard.loadComponent("dashboard-mapping", {
                mode: "create",
                data: {
                    dashboards: self.arrayDataSource()
                }
            });
        };
        var deleteMappingId;
        self.deleteMapping = function () {
            model.deleteDesignMapping(deleteMappingId).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr
                });
            });
        };
        self.arrayDataSource = ko.observableArray();
        self.datasource = new oj.ArrayTableDataSource(self.arrayDataSource, {
            idAttribute: "dashboardId"
        });
        /**
         * The model function called to fetch the dashboards created by the logged-in user
         * @function getDashboardList
         * @returns {void}
         */
        function getDashboardList() {
            model.getDashboardList().done(function (data) {
                self.arrayDataSource(data.dashboardDTOs);
            });
        }

        getDashboardList();
        self.confirmDelete = function (id) {
            deleteMappingId=id;
            $("#deleteDialog").trigger("openModal");
        };
        self.closeDeleteDialog = function () {
            $("#deleteDialog").hide();
        };
    };
    return vm;
});