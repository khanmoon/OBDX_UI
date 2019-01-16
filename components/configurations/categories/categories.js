define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/configurations",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol"

], function (oj, ko, $, CategoryModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resource = resourceBundle;
        self.listDataReady = ko.observable(false);
        self.configValue = ko.observable("");
        self.dataFetched = ko.observable(false);
        self.pristine = ko.observable(true);
        self.dataFiltered = ko.observable(true);
        self.categories = ko.observableArray();
        self.originalCategories = ko.observable();
        self.componentHeader = ko.observable(self.resource.configuration.categories.header);
        params.baseModel.registerElement("action-card");
        CategoryModel.getCategoriesList().done(function (data) {
            self.pristine(false);
            self.listDataReady(false);
            self.categories(data.categoryList);
            self.originalCategories(JSON.parse(ko.toJSON(self.categories)));
            self.dataSource = new oj.ArrayPagingDataSource(self.categories());
            self.categories(self.dataSource.getWindowObservable());
            self.listDataReady(true);
            self.dataFiltered(true);
            self.dataFetched(true);
        });
        var skipCategoryList = {
            webservices: "webservices",
            errormessages: "errors",
            infomessages: "infomessages",
            varconfigurations: "variable",
            restservices: "restservices"
        };
        var jumpToComponent = {
            varconfigurations: "variable-configurations",
            webservices: "web-services",
            errormessages: "error-messages",
            infomessages: "information-messages",
            indirectionconfigurations: "indirection-configurations",
            restservices: "rest-services"
        };
        var defaultCategoryId = {
            ERROR: "ErrorMessagesConfig_en",
            INFORMATIONMESSAGES: "InfoMessagesConfig_en",
            VARIABLE: "ConfigurationVariable",
            INDIRECTION: "IndirectionGenerationServiceConfig",
            baseconfigurations: "base",
            dmsconfigurations: "dms",
            RESTSERVICES: "restservices"
        };
        self.showProperty = function (data) {
            params.rootModel.categoryType(defaultCategoryId[data.tableName]);
            if (skipCategoryList.hasOwnProperty[data.tableName]) {
                params.rootModel.categoryValue(defaultCategoryId[data.categoryId]);
                params.baseModel.registerComponent(jumpToComponent[data.tableName], "configurations");
                self.configComponentName(jumpToComponent[data.tableName]);
            } else {
                params.rootModel.categoryValue(data.categoryId);
                params.rootModel.baseCategoryValue(data.categoryId);
                params.baseModel.registerComponent("categories-list", "configurations");
                self.configComponentName("categories-list");
            }
        };
        self.dataSource = new oj.ArrayPagingDataSource(self.categories());
        self.categories(self.dataSource.getWindowObservable());
        self.listDataReady(true);
        self.refreshDom = function () {
            self.listDataReady(false);
            self.listDataReady(true);
        };
        self.actionCardClick = function (id) {
            id.categoryId = id.categoryId.replace(/ /g, "");
            self.showProperty(id);
        };
        self.resetData = function () {
            self.configValue("");
            self.listDataReady(false);
            self.dataFiltered(false);
            self.categories(self.originalCategories());
            self.dataSource = new oj.ArrayPagingDataSource(self.categories());
            self.categories(self.dataSource.getWindowObservable());
            self.listDataReady(true);
            self.dataFiltered(true);
        };
        self.filterData = function () {
            params.rootModel.categoryFilterData = self.configValue;
            CategoryModel.getFilterCategoriesList(self.configValue()).done(function (data) {
                self.listDataReady(false);
                self.dataFiltered(false);
                self.categories(data.categoryList);
                self.dataSource = new oj.ArrayPagingDataSource(self.categories());
                self.categories(self.dataSource.getWindowObservable());
                self.listDataReady(true);
                self.dataFiltered(true);
            });
        };
        self.back = function () {
            history.back();
        };
    };
});
