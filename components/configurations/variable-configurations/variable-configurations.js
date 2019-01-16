define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/variable-configuration",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojcollapsible",
    "ojs/ojdialog",
    "ojs/ojpagingcontrol",

    "ojs/ojknockout-validation",
    "ojs/ojdialog",
    "ojs/ojpopup"
], function (oj, ko, $, VarConfigurationModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (params) {
        var i, self = this;
        ko.utils.extend(self, params.rootModel);
        self.resource = resourceBundle;
        self.configValue = ko.observable("");
        self.dataFiltered = ko.observable(false);
        self.dataRefreshed = ko.observable(false);
        self.refreshProperty = ko.observable(true);
        self.noRecFound = ko.observable();
        self.properties = ko.observableArray();
        self.categoryId = params.rootModel.categoryValue();
        self.originalCategories = ko.observableArray();
        self.showAddScreen = ko.observable(false);
        self.currentSelectedData = ko.observableArray();
        self.ackMsg = ko.observable();
        self.confirmMsg = ko.observable();
        self.validationTracker = ko.observable();
        self.addPropertyId = ko.observable();
        self.addPropertyValue = ko.observable();
        self.addFactoryShippedFlag = ko.observable();
        self.addPropertyComments = ko.observable();
        self.addEnvironmentId = ko.observable();
        self.isLoading = ko.observable(false);
        self.componentHeader = ko.observable(self.categoryId);
        self.actionRadios = ko.observableArray([
            {
                id: "edit",
                label: "View/Edit"
            },
            {
                id: "create",
                label: "Create"
            }
        ]);
        self.action = ko.observable("edit");
        self.handleActionChange = function (event, ui) {
            if (ui.option === "checked") {
                if (ui.value === "create") {
                    self.showAddScreen(true);
                    self.action("create");
                    for (i = 0; i < self.properties()().length; i++) {
                        self.properties()()[i].showPropflag(false);
                        self.properties()()[i].isActive(false);
                        self.properties()()[i].showEditRow(true);
                        self.properties()()[i].showUpdateRow(false);
                    }
                } else {
                    self.showAddScreen(false);
                    self.addPropertyId("");
                    self.addPropertyValue("");
                    self.addFactoryShippedFlag("");
                    self.addPropertyComments("");
                    self.addEnvironmentId("");
                }
            }
        };
        VarConfigurationModel.getPropertiesList(self.categoryId).done(function (data) {
            if (data.configResponseList) {
                for (i = 0; i < data.configResponseList.length; i++) {
                    data.configResponseList[i].showPropflag = ko.observable(false);
                    data.configResponseList[i].isActive = ko.observable(false);
                    data.configResponseList[i].propFetched = ko.observable(false);
                    data.configResponseList[i].showEditRow = ko.observable(true);
                    data.configResponseList[i].showUpdateRow = ko.observable(false);
                    data.configResponseList[i].enableReset = ko.observable(false);
                    if (!data.configResponseList[i].propertyValue) {
                        data.configResponseList[i].propertyValue = "";
                    }
                }
                self.dataSource = new oj.ArrayPagingDataSource(data.configResponseList);
                self.properties(self.dataSource.getWindowObservable());
                self.originalCategories(data.configResponseList);
                self.dataFiltered(true);
                self.dataRefreshed(true);
            } else {
                self.dataSource = new oj.ArrayPagingDataSource([]);
                self.properties(self.dataSource.getWindowObservable());
                self.originalCategories(data.configResponseList);
                self.dataFiltered(true);
                self.dataRefreshed(true);
                self.noRecFound = data.status.message.detail;
            }
        });
        self.showConfigScreen = function () {
            params.rootModel.registerComponent("categories", "configuration/categories/ko/template", "configuration/categories/ko/bindings");
            params.rootModel.configComponentName("categories");
        };
        self.filterData = function () {
            self.isLoading(true);
            self.dataRefreshed(false);
            self.dataFiltered(false);
            VarConfigurationModel.getFilteredProperties(self.categoryId, self.configValue()).done(function (data) {
                if (data.configResponseList) {
                    self.dataRefreshed(false);
                    self.dataFiltered(false);
                    for (i = 0; i < data.configResponseList.length; i++) {
                        data.configResponseList[i].showPropflag = ko.observable(false);
                        data.configResponseList[i].isActive = ko.observable(false);
                        data.configResponseList[i].propFetched = ko.observable(false);
                        data.configResponseList[i].showEditRow = ko.observable(true);
                        data.configResponseList[i].showUpdateRow = ko.observable(false);
                        data.configResponseList[i].enableReset = ko.observable(false);
                    }
                    self.properties(data.configResponseList);
                    self.dataSource = new oj.ArrayPagingDataSource(self.properties());
                    self.properties(self.dataSource.getWindowObservable());
                    self.isLoading(false);
                    self.dataRefreshed(true);
                    self.dataFiltered(true);
                } else {
                    self.dataSource = new oj.ArrayPagingDataSource([]);
                    self.properties(self.dataSource.getWindowObservable());
                    self.dataFiltered(true);
                    self.dataRefreshed(true);
                    self.noRecFound(data.status.message.detail);
                }
            }).fail(function () {
                self.isLoading(false);
                self.resetData();
            });
        };
        self.showProp = function (data) {
            self.showAddScreen(false);
            self.action("edit");
            for (i = 0; i < self.properties()().length; i++) {
                self.properties()()[i].showPropflag(false);
            }
            if (!data.showPropflag()) {
                self.currentActiveProperty = data;
                self.pristineProperty = JSON.parse(ko.toJSON(self.currentActiveProperty));
                self.pristineProperty.isActive = ko.observable(ko.utils.unwrapObservable(self.pristineProperty.isActive));
                self.pristineProperty.showEditRow = ko.observable(ko.utils.unwrapObservable(self.pristineProperty.showEditRow));
                self.pristineProperty.showUpdateRow = ko.observable(ko.utils.unwrapObservable(self.pristineProperty.showUpdateRow));
                self.pristineProperty.showPropflag = ko.observable(ko.utils.unwrapObservable(self.pristineProperty.showPropflag));
                VarConfigurationModel.getProperty(self.categoryId, data.propertyId, data.environmentId).done(function (data) {
                    self.currentActiveProperty.categoryId = data.configResponseList[0].categoryId;
                    self.currentActiveProperty.factoryShippedFlag = data.configResponseList[0].factoryShippedFlag;
                    self.currentActiveProperty.environmentId = data.configResponseList[0].environmentId;
                    self.currentActiveProperty.propertyComments = data.configResponseList[0].propertyComments;
                    self.currentActiveProperty.propertyId = data.configResponseList[0].propertyId;
                    self.currentActiveProperty.propertyValue = data.configResponseList[0].propertyValue;
                    self.currentActiveProperty.showPropflag(true);
                });
            } else {
                self.cancel(data);
                self.dataRefreshed(false);
                data.showPropflag(false);
                self.dataRefreshed(true);
            }
        };
        self.hideProp = function (data) {
            self.showAddScreen(false);
            self.action("edit");
            self.dataRefreshed(false);
            self.reset(data);
            data.isActive(false);
            data.showEditRow(true);
            data.showUpdateRow(false);
            self.dataRefreshed(true);
            data.showPropflag(false);
        };
        self.refreshDom = function () {
            self.dataRefreshed(false);
            self.dataRefreshed(true);
        };
        self.resetData = function () {
            self.configValue("");
            self.dataRefreshed(false);
            self.dataFiltered(false);
            self.properties(self.originalCategories());
            ko.tasks.runEarly();
            if (self.properties()) {
                self.dataSource = new oj.ArrayPagingDataSource(self.properties());
            } else {
                self.dataSource = new oj.ArrayPagingDataSource([]);
            }
            self.properties(self.dataSource.getWindowObservable());
            self.dataRefreshed(true);
            self.dataFiltered(true);
        };
        self.reset = function (data) {
            var i;
            self.dataRefreshed(false);
            data.showPropflag(false);
            for (i = 0; i < self.properties()().length; i++) {
                if (self.properties()()[i].propertyId === self.pristineProperty.propertyId) {
                    self.properties()()[i].propertyId = self.pristineProperty.propertyId;
                    self.properties()()[i].propertyValue = self.pristineProperty.propertyValue;
                    self.properties()()[i].environmentId = self.pristineProperty.environmentId;
                    self.properties()()[i].propertyComments = self.pristineProperty.propertyComments;
                    self.properties()()[i].factoryShippedFlag = self.pristineProperty.factoryShippedFlag;
                }
            }
            ko.tasks.runEarly();
            data.showPropflag(true);
            self.dataRefreshed(true);
        };
        self.showAddNewPropWindow = function () {
            self.dataRefreshed(false);
            self.dataFiltered(false);
            self.showAddScreen(true);
        };
        self.cancel = function (data) {
            self.reset(data);
            data.isActive(false);
            data.showEditRow(true);
            data.showUpdateRow(false);
            data.showPropflag(false);
        };
        self.editProperty = function (data) {
            data.isActive(true);
            data.showEditRow(false);
            data.showUpdateRow(true);
        };
        self.updateProperty = function (data, a) {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.refreshProperty(false);
            var sendData = ko.toJSON({
                categoryId: self.categoryId,
                configRequestList: [{
                        propertyId: data.propertyId,
                        propertyValue: data.propertyValue,
                        environmentId: data.environmentId,
                        factoryShippedFlag: data.factoryShippedFlag,
                        propertyComments: data.propertyComments
                    }]
            });
            self.currentSelectedData(data);
            self.properties()()[a].propertyValue = data.propertyValue;
            VarConfigurationModel.updateProperty(self.categoryId, sendData).done(function (data) {
                self.dataRefreshed(false);
                self.currentSelectedData().isActive(false);
                self.currentSelectedData().showEditRow(true);
                self.currentSelectedData().showUpdateRow(false);
                self.dataRefreshed(true);
                self.currentSelectedData([]);
                self.confirmMsg($.parseHTML(data.status.message.title)[0].data);
                self.configValue("");
                $("#confirmDialog").ojDialog("open");
            });
            self.refreshProperty(true);
        };
        self.deleteConfirm = function () {
            $("#deleteConfirm").ojDialog("open");
        };
        self.deleteProperty = function (data) {
            VarConfigurationModel.deleteProperty(self.categoryId, data.currentActiveProperty.propertyId, data.currentActiveProperty.environmentId).done(function (data) {
                self.confirmMsg($.parseHTML(data.status.message.title)[0].data);
                self.configValue("");
                self.dataRefreshed(false);
                self.dataFiltered(false);
                $("#deleteConfirm").ojDialog("close");
                $("#confirmDialog").ojDialog("open");
            });
        };
        self.cancelAddProperty = function () {
            self.clearAddProperty();
            self.showAddScreen(false);
            self.dataRefreshed(true);
            self.dataFiltered(true);
        };
        self.clearAddProperty = function () {
            self.showAddScreen(false);
            self.addPropertyId("");
            self.addPropertyValue("");
            self.addFactoryShippedFlag("");
            self.addPropertyComments("");
            self.addEnvironmentId("");
            self.showAddScreen(true);
        };
        self.addProperty = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var sendData = ko.toJSON({
                categoryId: self.categoryId,
                configRequestList: [{
                        propertyId: self.addPropertyId(),
                        propertyValue: self.addPropertyValue(),
                        environmentId: self.addEnvironmentId(),
                        propertyComments: self.addPropertyComments(),
                        factoryShippedFlag: self.addFactoryShippedFlag()
                    }]
            });
            VarConfigurationModel.addProperty(self.categoryId, sendData).done(function (data) {
                self.confirmMsg($.parseHTML(data.status.message.title)[0].data);
                $("#confirmDialog").ojDialog("open");
            });
        };
        self.confirmClick = function () {
            $("#confirmDialog").ojDialog("close");
            self.showAddScreen(false);
            self.dataRefreshed(false);
            self.dataFiltered(false);
            self.addPropertyId("");
            self.addPropertyValue("");
            self.addPropertyComments("");
            self.addEnvironmentId("");
            self.addFactoryShippedFlag("");
            self.action("edit");
            VarConfigurationModel.getPropertiesList(self.categoryId).done(function (data) {
                if (data.configResponseList) {
                    for (i = 0; i < data.configResponseList.length; i++) {
                        data.configResponseList[i].showPropflag = ko.observable(false);
                        data.configResponseList[i].isActive = ko.observable(false);
                        data.configResponseList[i].propFetched = ko.observable(false);
                        data.configResponseList[i].showEditRow = ko.observable(true);
                        data.configResponseList[i].showUpdateRow = ko.observable(false);
                        data.configResponseList[i].enableReset = ko.observable(false);
                        if (!data.configResponseList[i].propertyValue) {
                            data.configResponseList[i].propertyValue = "";
                        }
                    }
                    ko.tasks.runEarly();
                    self.dataSource = new oj.ArrayPagingDataSource(data.configResponseList);
                    self.properties(self.dataSource.getWindowObservable());
                    self.originalCategories(data.configResponseList);
                    self.dataFiltered(true);
                    self.dataRefreshed(true);
                } else {
                    self.dataSource = new oj.ArrayPagingDataSource([]);
                    self.properties(self.dataSource.getWindowObservable());
                    self.originalCategories(data.configResponseList);
                    self.dataFiltered(true);
                    self.dataRefreshed(true);
                    self.noRecFound = data.status.message.detail;
                }
            });
        };
    };
});