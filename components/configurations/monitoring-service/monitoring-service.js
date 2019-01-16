define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/monitoring-service",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojcollapsible",
    "ojs/ojdialog",
    "ojs/ojpagingcontrol",

    "ojs/ojknockout-validation",
    "ojs/ojdialog"
], function (oj, ko, $, DMSConfigurationModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (params) {
        var i, self = this;
        ko.utils.extend(self, params.rootModel);
        self.resource = resourceBundle;
        self.categoryId = params.rootModel.categoryValue();
        self.dataRefreshed = ko.observable(false);
        self.dataFiltered = ko.observable(false);
        self.properties = ko.observableArray();
        self.currentSelectedData = ko.observableArray();
        self.showAddScreen = ko.observable(false);
        self.configValue = ko.observable("");
        self.originalCategories = ko.observableArray();
        self.noRecFound = ko.observable(true);
        self.inputTextFocus = ko.observable(true);
        self.confirmMsg = ko.observable();
        self.validationTracker = ko.observable();
        self.addClassName = ko.observable();
        self.addMethodName = ko.observable();
        self.addInterpreter = ko.observable();
        self.addMonitor = ko.observable();
        self.addNesting = ko.observable();
        self.addOfType = ko.observable();
        self.nestingFlag = ko.observable(false);
        self.ofTypeFlag = ko.observable(false);
        self.isLoading = ko.observable(false);
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
                    self.addClassName("");
                    self.addMethodName("");
                    self.addInterpreter("");
                    self.addMonitor("");
                    if (self.nestingFlag() === false) {
                        self.addNesting("");
                    }
                    if (self.ofTypeFlag() === false) {
                        self.addOfType("");
                    }
                }
            }
        };
        DMSConfigurationModel.getPropertiesList(self.categoryId).done(function (data) {
            if (self.categoryId === "DMSHostNestedConfig") {
                self.nestingFlag(true);
                self.addNesting("Y");
                self.ofTypeFlag(true);
                self.addOfType("HOST");
            }
            if (self.categoryId === "DMSHostConfig") {
                self.addOfType("HOST");
                self.ofTypeFlag(true);
                self.nestingFlag(false);
            }
            if (self.categoryId === "DMSUIConfig") {
                self.addOfType("UI");
                self.ofTypeFlag(true);
                self.nestingFlag(false);
            }
            if (data.configResponseList) {
                for (i = 0; i < data.configResponseList.length; i++) {
                    data.configResponseList[i].showPropflag = ko.observable(false);
                    data.configResponseList[i].isActive = ko.observable(false);
                    data.configResponseList[i].propFetched = ko.observable(false);
                    data.configResponseList[i].showEditRow = ko.observable(true);
                    data.configResponseList[i].showUpdateRow = ko.observable(false);
                    data.configResponseList[i].enableReset = ko.observable(false);
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
        }).fail(function () {
            if (self.categoryId === "DMSHostNestedConfig") {
                self.nestingFlag(true);
                self.addNesting("Y");
                self.ofTypeFlag(true);
                self.addOfType("HOST");
            }
            if (self.categoryId === "DMSHostConfig") {
                self.addOfType("HOST");
                self.ofTypeFlag(true);
                self.nestingFlag(false);
            }
            if (self.categoryId === "DMSUIConfig") {
                self.addOfType("UI");
                self.ofTypeFlag(true);
                self.nestingFlag(false);
            }
        });
        self.showProp = function (data) {
            self.showAddScreen(false);
            self.action("edit");
            for (i = 0; i < self.properties()().length; i++) {
                self.properties()()[i].showPropflag(false);
            }
            self.inputTextFocus(false);
            if (!data.showPropflag()) {
                self.currentActiveProperty = data;
                self.pristineProperty = JSON.parse(ko.toJSON(self.currentActiveProperty));
                self.pristineProperty.isActive = ko.observable(ko.utils.unwrapObservable(self.pristineProperty.isActive));
                self.pristineProperty.showEditRow = ko.observable(ko.utils.unwrapObservable(self.pristineProperty.showEditRow));
                self.pristineProperty.showUpdateRow = ko.observable(ko.utils.unwrapObservable(self.pristineProperty.showUpdateRow));
                self.pristineProperty.showPropflag = ko.observable(ko.utils.unwrapObservable(self.pristineProperty.showPropflag));
                DMSConfigurationModel.getProperty(self.categoryId, data.propertyId).done(function (data) {
                    self.currentActiveProperty.categoryId = data.configResponseList[0].categoryId;
                    self.currentActiveProperty.propertyId = data.configResponseList[0].propertyId;
                    self.currentActiveProperty.propertyValue = data.configResponseList[0].propertyValue;
                    self.currentActiveProperty.monitor = data.configResponseList[0].monitor;
                    self.currentActiveProperty.nesting = data.configResponseList[0].nesting;
                    self.currentActiveProperty.interpreter = data.configResponseList[0].interpreter;
                    self.currentActiveProperty.className = data.configResponseList[0].className;
                    self.currentActiveProperty.methodName = data.configResponseList[0].methodName;
                    self.pristineProperty.monitor = data.configResponseList[0].monitor;
                    self.pristineProperty.nesting = data.configResponseList[0].nesting;
                    self.pristineProperty.interpreter = data.configResponseList[0].interpreter;
                    self.pristineProperty.className = data.configResponseList[0].className;
                    self.pristineProperty.methodName = data.configResponseList[0].methodName;
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
        self.editProperty = function (data) {
            data.isActive(true);
            data.showEditRow(false);
            data.showUpdateRow(true);
        };
        self.updateProperty = function (data) {
            var sendData = ko.toJSON({
                categoryId: self.categoryId,
                configRequestList: [{
                        className: data.className,
                        methodName: data.methodName,
                        monitor: data.monitor,
                        nesting: data.nesting,
                        interpreter: data.interpreter,
                        ofType: data.categoryId
                    }]
            });
            self.currentSelectedData(data);
            DMSConfigurationModel.updateProperty(self.categoryId, sendData).done(function (data) {
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
        };
        self.cancel = function (data) {
            self.reset(data);
            data.isActive(false);
            data.showEditRow(true);
            data.showUpdateRow(false);
            data.showPropflag(false);
        };
        self.reset = function (data) {
            var i;
            data.enableReset(true);
            data.showPropflag(false);
            for (i = 0; i < self.properties()().length; i++) {
                if (self.properties()()[i].propertyId === self.pristineProperty.propertyId) {
                    self.properties()()[i].propertyId = self.pristineProperty.propertyId;
                    self.properties()()[i].propertyValue = self.pristineProperty.propertyValue;
                    self.properties()()[i].className = self.pristineProperty.className;
                    self.properties()()[i].methodName = self.pristineProperty.methodName;
                    self.properties()()[i].monitor = self.pristineProperty.monitor;
                    self.properties()()[i].nesting = self.pristineProperty.nesting;
                    self.properties()()[i].interpreter = self.pristineProperty.interpreter;
                }
            }
            ko.tasks.runEarly();
            data.showPropflag(true);
            data.enableReset(false);
        };
        self.showAddNewPropWindow = function () {
            self.inputTextFocus(false);
            self.dataRefreshed(false);
            self.dataFiltered(false);
            self.showAddScreen(true);
        };
        self.cancelAddProperty = function () {
            self.clearAddProperty();
            self.showAddScreen(false);
            self.dataRefreshed(true);
            self.dataFiltered(true);
            self.inputTextFocus(true);
        };
        self.clearAddProperty = function () {
            self.showAddScreen(false);
            self.addClassName("");
            self.addMethodName("");
            self.addInterpreter("");
            self.addMonitor("");
            self.addNesting("");
            self.addOfType("");
            self.showAddScreen(true);
        };
        self.addProperty = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var sendData = ko.toJSON({
                categoryId: self.categoryId,
                configRequestList: [{
                        className: self.addClassName(),
                        methodName: self.addMethodName(),
                        ofType: self.addOfType(),
                        interpreter: self.addInterpreter(),
                        monitor: self.addMonitor(),
                        nesting: self.addNesting()
                    }]
            });
            DMSConfigurationModel.addProperty(self.categoryId, sendData).done(function (data) {
                self.confirmMsg($.parseHTML(data.status.message.title)[0].data);
                $("#confirmDialog").ojDialog("open");
            });
        };
        self.confirmClick = function () {
            $("#confirmDialog").ojDialog("close");
            self.showAddScreen(false);
            self.dataRefreshed(false);
            self.dataFiltered(false);
            self.action("edit");
            DMSConfigurationModel.getPropertiesList(self.categoryId).done(function (data) {
                if (data.configResponseList) {
                    for (i = 0; i < data.configResponseList.length; i++) {
                        data.configResponseList[i].showPropflag = ko.observable(false);
                        data.configResponseList[i].isActive = ko.observable(false);
                        data.configResponseList[i].propFetched = ko.observable(false);
                        data.configResponseList[i].showEditRow = ko.observable(true);
                        data.configResponseList[i].showUpdateRow = ko.observable(false);
                        data.configResponseList[i].enableReset = ko.observable(false);
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
        self.deleteConfirm = function () {
            $("#deleteConfirm").ojDialog("open");
        };
        self.deleteProperty = function (data) {
            DMSConfigurationModel.deleteProperty(self.categoryId, data.currentActiveProperty.propertyId).done(function (data) {
                self.confirmMsg($.parseHTML(data.status.message.title)[0].data);
                self.configValue("");
                self.dataRefreshed(false);
                self.dataFiltered(false);
                $("#deleteConfirm").ojDialog("close");
                $("#confirmDialog").ojDialog("open");
            });
        };
        self.filterData = function () {
            self.isLoading(true);
            self.dataRefreshed(false);
            self.dataFiltered(false);
            DMSConfigurationModel.getFilteredProperties(self.categoryId, self.configValue()).done(function (data) {
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
                    self.dataRefreshed(false);
                    self.dataFiltered(false);
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
        self.showConfigScreen = function () {
            params.rootModel.registerComponent("categories", "configurations");
            params.rootModel.configComponentName("categories");
        };
    };
});