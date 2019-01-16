define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/base-configurations",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojcollapsible",
    "ojs/ojdialog",
    "ojs/ojpagingcontrol",

    "ojs/ojknockout-validation",
    "ojs/ojdialog",
    "ojs/ojpopup",
    "ojs/ojselectcombobox"
], function (oj, ko, $, AdvBaseConfigurationModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (params) {
        var i, self = this;
        ko.utils.extend(self, params.rootModel);
        self.resource = resourceBundle;
        self.categoryId = null;
        self.dataRefreshed = ko.observable(false);
        self.dataFiltered = ko.observable(false);
        self.properties = ko.observableArray();
        self.currentSelectedData = ko.observableArray();
        self.showAddScreen = ko.observable(false);
        self.configValue = ko.observable("");
        self.originalCategories = ko.observableArray();
        self.noRecFound = ko.observable();
        self.confirmMsg = ko.observable();
        self.ackMsg = ko.observable();
        self.validationTracker = ko.observable();
        self.searchText = ko.observable();
        self.selectedCategory = ko.observable();
        self.isLoading = ko.observable(false);
        self.categoriesLoaded = ko.observable(false);
        self.selectDescriptions = ko.observableArray();
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
                }
            }
        };
        AdvBaseConfigurationModel.getPropertiesList().done(function (data) {
            var tempCategory;
            if (data.configResponseList) {
                self.selectDescriptions.push({
                    value: data.configResponseList[0].categoryId,
                    label: data.configResponseList[0].categoryDescription ? data.configResponseList[0].categoryDescription : data.configResponseList[0].categoryId
                });
                for (i = 0; i < data.configResponseList.length; i++) {
                    tempCategory = null;
                    if (!data.configResponseList[i].categoryDescription) {
                        data.configResponseList[i].categoryDescription = data.configResponseList[i].categoryId;
                    }
                    if (!data.configResponseList[i].propertyValue) {
                        data.configResponseList[i].propertyValue = "";
                    }
                    data.configResponseList[i].showPropflag = ko.observable(false);
                    data.configResponseList[i].isActive = ko.observable(false);
                    data.configResponseList[i].propFetched = ko.observable(false);
                    data.configResponseList[i].showEditRow = ko.observable(true);
                    data.configResponseList[i].showUpdateRow = ko.observable(false);
                    data.configResponseList[i].enableReset = ko.observable(false);
                    tempCategory = ko.utils.arrayFilter(self.selectDescriptions(), function (category) {
                        if (category.value === data.configResponseList[i].categoryId) {
                            return data.configResponseList[i].categoryId;
                        }
                    });
                    if (!tempCategory[0]) {
                        self.selectDescriptions.push({
                            value: data.configResponseList[i].categoryId,
                            label: data.configResponseList[i].categoryDescription
                        });
                    }
                }
                self.dataSource = new oj.ArrayPagingDataSource(data.configResponseList);
                self.properties(self.dataSource.getWindowObservable());
                self.originalCategories(data.configResponseList);
                self.dataFiltered(true);
                self.dataRefreshed(true);
                self.categoriesLoaded(true);
            } else {
                self.dataSource = new oj.ArrayPagingDataSource([]);
                self.properties(self.dataSource.getWindowObservable());
                self.originalCategories(data.configResponseList);
                self.dataFiltered(true);
                self.dataRefreshed(true);
                self.noRecFound = data.status.message.detail;
            }
        });
        self.optionChangedHandler = function (event) {
            if (event.detail.value) {
                if (!event.detail.value) {
                    self.resetData();
                    return;
                }
                self.isLoading(true);
                self.dataRefreshed(false);
                self.dataFiltered(false);
                AdvBaseConfigurationModel.getFilteredProperties(event.detail.value).done(function (data) {
                    if (data.configResponseList) {
                        self.dataRefreshed(false);
                        self.dataFiltered(false);
                        for (i = 0; i < data.configResponseList.length; i++) {
                            if (!data.configResponseList[i].propertyValue) {
                                data.configResponseList[i].propertyValue = "";
                            }
                            if (!data.configResponseList[i].categoryDescription) {
                                data.configResponseList[i].categoryDescription = data.configResponseList[i].categoryId;
                            }
                            data.configResponseList[i].showPropflag = ko.observable(false);
                            data.configResponseList[i].isActive = ko.observable(false);
                            data.configResponseList[i].propFetched = ko.observable(false);
                            data.configResponseList[i].showEditRow = ko.observable(true);
                            data.configResponseList[i].showUpdateRow = ko.observable(false);
                            data.configResponseList[i].enableReset = ko.observable(false);
                        }
                        self.properties(data.configResponseList);
                        ko.tasks.runEarly();
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
                        self.noRecFound = data.status.message.detail;
                    }
                }).fail(function () {
                    self.resetData();
                    self.isLoading(false);
                });
            }
        };
        self.searchProperty = function () {
            self.isLoading(true);
            self.dataRefreshed(false);
            self.dataFiltered(false);
            AdvBaseConfigurationModel.getPropertiesListByDescription(self.searchText()).done(function (data) {
                if (data.configResponseList) {
                    self.dataRefreshed(false);
                    self.dataFiltered(false);
                    for (i = 0; i < data.configResponseList.length; i++) {
                        if (!data.configResponseList[i].propertyValue) {
                            data.configResponseList[i].propertyValue = "";
                        }
                        if (!data.configResponseList[i].categoryDescription) {
                            data.configResponseList[i].categoryDescription = data.configResponseList[i].categoryId;
                        }
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
                    self.noRecFound = data.status.message.detail;
                }
            }).fail(function () {
                self.resetData();
                self.isLoading(false);
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
                AdvBaseConfigurationModel.getProperty(data.categoryId, data.propertyId).done(function (data) {
                    if (!data.configResponseList[0].propertyValue) {
                        data.configResponseList[0].propertyValue = "";
                    }
                    if (!data.configResponseList[0].categoryDescription) {
                        data.configResponseList[0].categoryDescription = data.configResponseList[0].categoryId;
                    }
                    self.currentActiveProperty.categoryId = data.configResponseList[0].categoryId;
                    self.currentActiveProperty.propertyId = data.configResponseList[0].propertyId;
                    self.currentActiveProperty.propertyValue = data.configResponseList[0].propertyValue;
                    self.currentActiveProperty.categoryDescription = data.configResponseList[0].categoryDescription;
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
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var sendData = ko.toJSON({
                categoryId: data.categoryId,
                configRequestList: [{
                        propertyId: data.propertyId,
                        propertyValue: data.propertyValue,
                        categoryDescription: data.categoryDescription,
                        editable: data.editable
                    }]
            });
            self.currentSelectedData(data);
            AdvBaseConfigurationModel.updateProperty(data.categoryId, sendData).done(function (data) {
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
                }
            }
            ko.tasks.runEarly();
            data.showPropflag(true);
            data.enableReset(false);
        };
        self.deleteConfirm = function () {
            $("#deleteConfirm").trigger("openModal");
        };
        self.deleteProperty = function (data) {
            AdvBaseConfigurationModel.deleteProperty(data.currentActiveProperty.categoryId, data.currentActiveProperty.propertyId).done(function (data) {
                self.confirmMsg($.parseHTML(data.status.message.title)[0].data);
                self.configValue("");
                self.dataRefreshed(false);
                self.dataFiltered(false);
                $("#deleteConfirm").trigger("closeModal");
                $("#confirmDialog").ojDialog("open");
            });
        };
        self.resetData = function () {
            self.configValue("");
            self.searchText("");
            self.categoriesLoaded(false);
            self.selectedCategory("");
            ko.tasks.runEarly();
            self.categoriesLoaded(true);
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
            params.baseModel.registerComponent("configurations-home", "configurations");
            params.dashboard.loadComponent("configurations-home", {}, self);
        };
        self.confirmClick = function () {
            $("#confirmDialog").ojDialog("close");
            self.showAddScreen(false);
            self.dataRefreshed(false);
            self.dataFiltered(false);
            self.action("edit");
            AdvBaseConfigurationModel.getPropertiesList().done(function (data) {
                if (data.configResponseList) {
                    for (i = 0; i < data.configResponseList.length; i++) {
                        if (!data.configResponseList[i].propertyValue) {
                            data.configResponseList[i].propertyValue = "";
                        }
                        if (!data.configResponseList[i].categoryDescription) {
                            data.configResponseList[i].categoryDescription = data.configResponseList[i].categoryId;
                        }
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
    };
});
