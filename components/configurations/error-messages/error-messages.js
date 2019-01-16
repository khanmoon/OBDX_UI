define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/error-messages",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojcollapsible",
    "ojs/ojdialog",
    "ojs/ojpagingcontrol",

    "ojs/ojknockout-validation",
    "ojs/ojdialog"
], function (oj, ko, $, ErrorModel, BaseLogger, resourceBundle) {
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
        self.noRecFound = ko.observable();
        self.validationTracker = ko.observable();
        self.confirmMsg = ko.observable();
        self.addErrorCode = ko.observable();
        self.addErrorMsg = ko.observable();
        self.addFactoryshipflag = ko.observable();
        self.addUserLocale = ko.observable();
        self.addSummaryText = ko.observable();
        self.userLocale = ko.observable();
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
                    self.addErrorCode("");
                    self.addErrorMsg("");
                    self.addFactoryshipflag("");
                    self.addUserLocale("");
                    self.addSummaryText("");
                }
            }
        };
        ErrorModel.getUserLocale();
        ErrorModel.getPropertiesList(self.categoryId).done(function (data) {
            if (data.configResponseList) {
                for (i = 0; i < data.configResponseList.length; i++) {
                    data.configResponseList[i].showPropflag = ko.observable(false);
                    data.configResponseList[i].isActive = ko.observable(false);
                    data.configResponseList[i].propFetched = ko.observable(false);
                    data.configResponseList[i].showEditRow = ko.observable(true);
                    data.configResponseList[i].showUpdateRow = ko.observable(false);
                    data.configResponseList[i].enableReset = ko.observable(false);
                    self.userLocale = data.configResponseList[i].userLocaleId;
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
                ErrorModel.getProperty(self.categoryId, data.errorCode).done(function (data) {
                    self.currentActiveProperty.categoryId = data.configResponseList[0].categoryId;
                    self.currentActiveProperty.factoryshipflag = data.configResponseList[0].factoryShippedFlag;
                    self.currentActiveProperty.userLocaleId = data.configResponseList[0].userLocaleId;
                    self.currentActiveProperty.errorCode = data.configResponseList[0].errorCode;
                    self.currentActiveProperty.errorMessage = data.configResponseList[0].errorMessage;
                    self.currentActiveProperty.summaryText = data.configResponseList[0].summaryText;
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
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var sendData = ko.toJSON({
                userLocaleId: data.userLocaleId,
                configRequestList: [{
                        errorCode: data.errorCode,
                        errorMessage: data.errorMessage,
                        summaryText: data.summaryText,
                        factoryShippedFlag: data.factoryshipflag
                    }]
            });
            self.currentSelectedData(data);
            ErrorModel.updateProperty(self.categoryId, sendData).done(function (data) {
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
            data.enableReset(true);
            var i;
            data.showPropflag(false);
            for (i = 0; i < self.properties()().length; i++) {
                if (self.properties()()[i].errorCode === self.pristineProperty.errorCode) {
                    self.properties()()[i].errorCode = self.pristineProperty.errorCode;
                    self.properties()()[i].errorMessage = self.pristineProperty.errorMessage;
                    self.properties()()[i].userLocaleId = self.pristineProperty.userLocaleId;
                    self.properties()()[i].factoryshipflag = self.pristineProperty.factoryShippedFlag;
                    self.properties()()[i].summaryText = self.pristineProperty.summaryText;
                    self.properties()()[i].enableReset(false);
                }
            }
            ko.tasks.runEarly();
            data.showPropflag(true);
        };
        self.showAddNewPropWindow = function () {
            self.dataRefreshed(false);
            self.dataFiltered(false);
            self.showAddScreen(true);
        };
        self.cancelAddProperty = function () {
            self.clearAddProperty();
            self.showAddScreen(false);
            self.dataRefreshed(true);
            self.dataFiltered(true);
        };
        self.clearAddProperty = function () {
            self.showAddScreen(false);
            self.addErrorCode("");
            self.addErrorMsg("");
            self.addFactoryshipflag("");
            self.addUserLocale("");
            self.addSummaryText("");
            self.showAddScreen(true);
        };
        self.addProperty = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var sendData = ko.toJSON({
                userLocaleId: self.addUserLocale,
                configRequestList: [{
                        errorCode: self.addErrorCode(),
                        errorMessage: self.addErrorMsg(),
                        summaryText: self.addSummaryText(),
                        factoryShippedFlag: self.addFactoryshipflag()
                    }]
            });
            ErrorModel.addProperty(self.categoryId, sendData).done(function (data) {
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
            ErrorModel.getPropertiesList(self.categoryId).done(function (data) {
                if (data.configResponseList) {
                    for (i = 0; i < data.configResponseList.length; i++) {
                        data.configResponseList[i].showPropflag = ko.observable(false);
                        data.configResponseList[i].isActive = ko.observable(false);
                        data.configResponseList[i].propFetched = ko.observable(false);
                        data.configResponseList[i].showEditRow = ko.observable(true);
                        data.configResponseList[i].showUpdateRow = ko.observable(false);
                        data.configResponseList[i].enableReset = ko.observable(false);
                        self.userLocale = data.configResponseList[i].userLocaleId;
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
            ErrorModel.deleteProperty(self.categoryId, data.currentActiveProperty.errorCode).done(function (data) {
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
            ErrorModel.getFilteredProperties(self.categoryId, self.configValue()).done(function (data) {
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
            params.rootModel.registerComponent("categories", "configuration/categories/ko/template", "configuration/categories/ko/bindings");
            params.rootModel.configComponentName("categories");
        };
    };
});