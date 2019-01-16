define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/rest-services",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojdialog",
    "ojs/ojpagingcontrol",

    "ojs/ojknockout-validation",
    "ojs/ojdialog",
    "ojs/ojpopup"
], function (oj, ko, $, RestServiceModel, BaseLogger, resourceBundle) {
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
        self.confirmMsg = ko.observable();
        self.validationTracker = ko.observable();
        self.addauthType = ko.observable();
        self.addauthentication = ko.observable();
        self.addcontextUrl = ko.observable();
        self.addcredentialStoreKey = ko.observable();
        self.addcredentialStoreType = ko.observable();
        self.addobjectVersionNumber = ko.observable();
        self.addrequestMediaType = ko.observable();
        self.addresponseMediaType = ko.observable();
        self.addserviceId = ko.observable("");
        self.addserviceUrl = ko.observable();
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
                    self.addauthType("");
                    self.addauthentication("");
                    self.addcontextUrl("");
                    self.addcredentialStoreKey("");
                    self.addcredentialStoreType("");
                    self.addobjectVersionNumber("");
                    self.addrequestMediaType("");
                    self.addresponseMediaType("");
                    self.addserviceId("");
                    self.addserviceUrl("");
                }
            }
        };
        RestServiceModel.getPropertiesList(self.categoryId).done(function (data) {
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
                RestServiceModel.getProperty(data.serviceId).done(function (data) {
                    self.currentActiveProperty.categoryId = self.categoryId;
                    self.currentActiveProperty.authType = data.configResponseList[0].authType;
                    self.currentActiveProperty.authentication = data.configResponseList[0].authentication;
                    self.currentActiveProperty.contextUrl = data.configResponseList[0].contextUrl;
                    self.currentActiveProperty.credentialStoreKey = data.configResponseList[0].credentialStoreKey;
                    self.currentActiveProperty.credentialStoreType = data.configResponseList[0].credentialStoreType;
                    self.currentActiveProperty.objectVersionNumber = data.configResponseList[0].objectVersionNumber;
                    self.currentActiveProperty.requestMediaType = data.configResponseList[0].requestMediaType;
                    self.currentActiveProperty.responseMediaType = data.configResponseList[0].responseMediaType;
                    self.currentActiveProperty.serviceId = data.configResponseList[0].serviceId;
                    self.currentActiveProperty.serviceUrl = data.configResponseList[0].serviceUrl;
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
                authType: data.authType,
                authentication: data.authentication,
                contextUrl: data.contextUrl,
                credentialStoreKey: data.credentialStoreKey,
                credentialStoreType: data.credentialStoreType,
                objectVersionNumber: data.objectVersionNumber,
                requestMediaType: data.requestMediaType,
                responseMediaType: data.responseMediaType,
                serviceUrl: data.serviceUrl
            });
            self.currentSelectedData(data);
            RestServiceModel.updateProperty(data.serviceId, sendData).done(function (data) {
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
                if (self.properties()()[i].serviceId + "." + self.properties()()[i].self.pristineProperty.serviceId) {
                    self.properties()()[i].authType = self.pristineProperty.authType;
                    self.properties()()[i].authentication = self.pristineProperty.authentication;
                    self.properties()()[i].contextUrl = self.pristineProperty.contextUrl;
                    self.properties()()[i].credentialStoreKey = self.pristineProperty.credentialStoreKey;
                    self.properties()()[i].credentialStoreType = self.pristineProperty.credentialStoreType;
                    self.properties()()[i].objectVersionNumber = self.pristineProperty.objectVersionNumber;
                    self.properties()()[i].requestMediaType = self.pristineProperty.requestMediaType;
                    self.properties()()[i].responseMediaType = self.pristineProperty.responseMediaType;
                    self.properties()()[i].serviceId = self.pristineProperty.serviceId;
                    self.properties()()[i].serviceUrl = self.pristineProperty.serviceUrl;
                }
            }
            ko.tasks.runEarly();
            data.showPropflag(true);
            data.enableReset(false);
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
            self.addauthType("");
            self.addauthentication("");
            self.addcontextUrl("");
            self.addcredentialStoreKey("");
            self.addcredentialStoreType("");
            self.addobjectVersionNumber("");
            self.addrequestMediaType("");
            self.addresponseMediaType("");
            self.addserviceId("");
            self.addserviceUrl("");
            self.addStubClass("");
            self.addSecurityPolicy("");
            self.addEndPointUrl("");
            self.showAddScreen(true);
        };
        self.addProperty = function () {
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var sendData = ko.toJSON({
                authType: self.addauthType(),
                authentication: self.addauthentication(),
                contextUrl: self.addcontextUrl(),
                credentialStoreKey: self.addcredentialStoreKey(),
                credentialStoreType: self.addcredentialStoreType(),
                objectVersionNumber: self.addobjectVersionNumber(),
                requestMediaType: self.addrequestMediaType(),
                responseMediaType: self.addresponseMediaType(),
                serviceUrl: self.addserviceUrl()
            });
            RestServiceModel.addProperty(self.addserviceId(), sendData).done(function (data) {
                self.confirmMsg($.parseHTML(data.status.message.title)[0].data);
                $("#confirmDialog").ojDialog("open");
            });
        };
        self.deleteConfirm = function () {
            $("#deleteConfirm").ojDialog("open");
        };
        self.deleteProperty = function () {
            RestServiceModel.deleteProperty(self.currentActiveProperty.serviceId).done(function (data) {
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
            RestServiceModel.getFilteredProperties(self.configValue()).done(function (data) {
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
        self.confirmClick = function () {
            $("#confirmDialog").ojDialog("close");
            self.showAddScreen(false);
            self.dataRefreshed(false);
            self.dataFiltered(false);
            self.addauthType("");
            self.addauthentication("");
            self.addcontextUrl("");
            self.addcredentialStoreKey("");
            self.addcredentialStoreType("");
            self.addobjectVersionNumber("");
            self.addrequestMediaType("");
            self.addresponseMediaType("");
            self.addserviceId("");
            self.addserviceUrl("");
            self.action("edit");
            RestServiceModel.getPropertiesList(self.categoryId).done(function (data) {
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
    };
});