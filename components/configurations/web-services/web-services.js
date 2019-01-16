define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/web-services",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojcollapsible",
    "ojs/ojdialog",
    "ojs/ojpagingcontrol",

    "ojs/ojknockout-validation",
    "ojs/ojdialog",
    "ojs/ojpopup"
], function (oj, ko, $, WebServicesModel, BaseLogger, resourceBundle) {
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
        self.ackMsg = ko.observable();
        self.validationTracker = ko.observable();
        self.addServiceId = ko.observable();
        self.addProcess = ko.observable();
        self.addService = ko.observable();
        self.addNameSpace = ko.observable();
        self.addUrl = ko.observable();
        self.addStubService = ko.observable();
        self.addTimeOut = ko.observable();
        self.addEndPointName = ko.observable();
        self.addEndPointUrl = ko.observable();
        self.addSecurityPolicy = ko.observable();
        self.addProxyClassName = ko.observable();
        self.addStubClass = ko.observable();
        self.addIp = ko.observable();
        self.addPort = ko.observable();
        self.addUser = ko.observable();
        self.addPassword = ko.observable();
        self.addHttpBasicAuthConnector = ko.observable();
        self.addHttpBasicAuthRealm = ko.observable();
        self.addAnonymousSecurityPolicy = ko.observable();
        self.addAnonymousSecurityKeyName = ko.observable();
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
                    self.addServiceId("");
                    self.addProcess("");
                    self.addService("");
                    self.addNameSpace("");
                    self.addUrl("");
                    self.addStubService("");
                    self.addTimeOut("");
                    self.addEndPointName("");
                    self.addEndPointUrl("");
                    self.addSecurityPolicy("");
                    self.addProxyClassName("");
                    self.addStubClass("");
                    self.addIp("");
                    self.addPort("");
                    self.addUser("");
                    self.addPassword("");
                    self.addHttpBasicAuthConnector("");
                    self.addHttpBasicAuthRealm("");
                    self.addAnonymousSecurityPolicy("");
                    self.addAnonymousSecurityKeyName("");
                }
            }
        };
        WebServicesModel.getPropertiesList(self.categoryId).done(function (data) {
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
                WebServicesModel.getProperty(self.categoryId, data.serviceId.trim() + "." + data.process).done(function (data) {
                    self.currentActiveProperty.categoryId = self.categoryId;
                    self.currentActiveProperty.url = data.configResponseList[0].url;
                    self.currentActiveProperty.namespace = data.configResponseList[0].namespace;
                    self.currentActiveProperty.timeOut = data.configResponseList[0].timeOut;
                    self.currentActiveProperty.process = data.configResponseList[0].process;
                    self.currentActiveProperty.serviceId = data.configResponseList[0].serviceId;
                    self.currentActiveProperty.service = data.configResponseList[0].service;
                    self.currentActiveProperty.endpointName = data.configResponseList[0].endpointName;
                    self.currentActiveProperty.proxyClassName = data.configResponseList[0].proxyClassName;
                    self.currentActiveProperty.stubService = data.configResponseList[0].stubService;
                    self.currentActiveProperty.nameSpace = data.configResponseList[0].nameSpace;
                    self.currentActiveProperty.stubClass = data.configResponseList[0].stubClass;
                    self.currentActiveProperty.ip = data.configResponseList[0].ip;
                    self.currentActiveProperty.port = data.configResponseList[0].port;
                    self.currentActiveProperty.user = data.configResponseList[0].user;
                    self.currentActiveProperty.password = data.configResponseList[0].password;
                    self.currentActiveProperty.securityPolicy = data.configResponseList[0].securityPolicy;
                    self.currentActiveProperty.endPointUrl = data.configResponseList[0].endPointUrl;
                    self.currentActiveProperty.httpBasicAuthRealm = data.configResponseList[0].httpBasicAuthRealm;
                    self.currentActiveProperty.httpBasicAuthConnector = data.configResponseList[0].httpBasicAuthConnector;
                    self.currentActiveProperty.anonymousSecurityPolicy = data.configResponseList[0].anonymousSecurityPolicy;
                    self.currentActiveProperty.anonymousSecurityKeyName = data.configResponseList[0].anonymousSecurityKeyName;
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
                categoryId: self.categoryId,
                configRequestList: [{
                        propertyId: data.serviceId.trim() + "." + data.process,
                        url: data.url,
                        nameSpace: data.nameSpace,
                        timeOut: data.timeOut,
                        proxyClassName: data.proxyClassName,
                        stubService: data.stubService,
                        endpointName: data.endpointName,
                        service: data.service,
                        ip: data.ip,
                        port: data.port,
                        user: data.user,
                        password: data.password,
                        securityPolicy: data.securityPolicy,
                        endPointUrl: data.endPointUrl,
                        stubClass: data.stubClass,
                        httpBasicAuthConnector: data.httpBasicAuthConnector,
                        httpBasicAuthRealm: data.httpBasicAuthRealm,
                        anonymousSecurityPolicy: data.anonymousSecurityPolicy,
                        anonymousSecurityKeyName: data.anonymousSecurityKeyName
                    }]
            });
            self.currentSelectedData(data);
            WebServicesModel.updateProperty(self.categoryId, sendData).done(function (data) {
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
                if (self.properties()()[i].serviceId + "." + self.properties()()[i].process === self.pristineProperty.serviceId + "." + self.pristineProperty.process) {
                    self.properties()()[i].serviceId = self.pristineProperty.serviceId;
                    self.properties()()[i].process = self.pristineProperty.process;
                    self.properties()()[i].nameSpace = self.pristineProperty.nameSpace;
                    self.properties()()[i].stubService = self.pristineProperty.stubService;
                    self.properties()()[i].service = self.pristineProperty.service;
                    self.properties()()[i].timeOut = self.pristineProperty.timeOut;
                    self.properties()()[i].url = self.pristineProperty.url;
                    self.properties()()[i].endpointName = self.pristineProperty.endpointName;
                    self.properties()()[i].ip = self.pristineProperty.ip;
                    self.properties()()[i].port = self.pristineProperty.port;
                    self.properties()()[i].user = self.pristineProperty.user;
                    self.properties()()[i].password = self.pristineProperty.password;
                    self.properties()()[i].endPointUrl = self.pristineProperty.endPointUrl;
                    self.properties()()[i].stubClass = self.pristineProperty.stubClass;
                    self.properties()()[i].securityPolicy = self.pristineProperty.securityPolicy;
                    self.properties()()[i].httpBasicAuthConnector = self.pristineProperty.httpBasicAuthConnector;
                    self.properties()()[i].httpBasicAuthRealm = self.pristineProperty.httpBasicAuthRealm;
                    self.properties()()[i].anonymousSecurityPolicy = self.pristineProperty.anonymousSecurityPolicy;
                    self.properties()()[i].anonymousSecurityKeyName = self.pristineProperty.anonymousSecurityKeyName;
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
            self.addServiceId("");
            self.addProcess("");
            self.addService("");
            self.addNameSpace("");
            self.addUrl("");
            self.addStubService("");
            self.addTimeOut("");
            self.addEndPointName("");
            self.addProxyClassName("");
            self.addIp("");
            self.addPort("");
            self.addUser("");
            self.addPassword("");
            self.addHttpBasicAuthConnector("");
            self.addHttpBasicAuthRealm("");
            self.addAnonymousSecurityKeyName("");
            self.addAnonymousSecurityPolicy("");
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
                categoryId: self.categoryId,
                configRequestList: [{
                        propertyId: self.addServiceId().trim() + "." + self.addProcess(),
                        service: self.addService(),
                        timeOut: self.addTimeOut(),
                        nameSpace: self.addNameSpace(),
                        url: self.addUrl(),
                        proxyClassName: self.addProxyClassName(),
                        stubService: self.addStubService(),
                        stubClass: self.addStubClass(),
                        endpointName: self.addEndPointName(),
                        ip: self.addIp(),
                        port: self.addPort(),
                        user: self.addUser(),
                        password: self.addPassword(),
                        securityPolicy: self.addSecurityPolicy(),
                        endPointUrl: self.addEndPointUrl(),
                        httpBasicAuthConnector: self.addHttpBasicAuthConnector(),
                        httpBasicAuthRealm: self.addHttpBasicAuthRealm(),
                        anonymousSecurityPolicy: self.addAnonymousSecurityPolicy(),
                        anonymousSecurityKeyName: self.addAnonymousSecurityKeyName()
                    }]
            });
            WebServicesModel.addProperty(self.categoryId, sendData).done(function (data) {
                self.confirmMsg($.parseHTML(data.status.message.title)[0].data);
                $("#confirmDialog").ojDialog("open");
            });
        };
        self.deleteConfirm = function () {
            $("#deleteConfirm").ojDialog("open");
        };
        self.deleteProperty = function () {
            WebServicesModel.deleteProperty(self.categoryId, self.currentActiveProperty.serviceId.trim() + "." + self.currentActiveProperty.process).done(function (data) {
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
            WebServicesModel.getFilteredProperties(self.categoryId, self.configValue()).done(function (data) {
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
            self.addServiceId("");
            self.addProcess("");
            self.addService("");
            self.addNameSpace("");
            self.addUrl("");
            self.addStubService("");
            self.addTimeOut("");
            self.addEndPointName("");
            self.addProxyClassName("");
            self.addIp("");
            self.addPort("");
            self.addUser("");
            self.addPassword("");
            self.addHttpBasicAuthConnector("");
            self.addHttpBasicAuthRealm("");
            self.addAnonymousSecurityKeyName("");
            self.addAnonymousSecurityPolicy("");
            self.addStubClass("");
            self.addSecurityPolicy("");
            self.addEndPointUrl("");
            self.action("edit");
            WebServicesModel.getPropertiesList(self.categoryId).done(function (data) {
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