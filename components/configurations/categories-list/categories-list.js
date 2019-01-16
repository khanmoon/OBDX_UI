define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/configurations",
    "ojL10n!resources/nls/category-description",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol",

    "ojs/ojselectcombobox"
], function (oj, ko, $, ListCategoryModel, resourceBundle, categoryResourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resource = resourceBundle;
        self.categoryResource = categoryResourceBundle;
        self.categoryDescription = ko.observableArray();
        self.listDataReady = ko.observable(false);
        self.configValue = ko.observable("");
        self.dataFetched = ko.observable(false);
        self.pristine = ko.observable(true);
        self.dataFiltered = ko.observable(true);
        self.categories = ko.observableArray();
        self.originalCategories = ko.observable();
        self.selectCategories = ko.observableArray();
        self.loadTemplate = ko.observable();
        self.compData = ko.observableArray();
        self.selectedValue = ko.observable();
        self.showPropertyDiv = ko.observable(false);
        self.componentHeader = self.baseCategoryValue;
        params.baseModel.registerComponent("base-configurations", "configurations");
        self.propertyComponent = ko.observable("baseconfigurations");
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
        ListCategoryModel.getCategoriesList(self.categoryType()).done(function (data) {
            self.pristine(false);
            self.listDataReady(false);
            self.originalCategories(data.categoryList);
            self.categories(data.categoryList);
            for (var i = 0; i < data.categoryList.length; i++) {
                self.selectCategories.push({
                    value: data.categoryList[i],
                    label: data.categoryList[i].categoryId
                });
            }
            self.listDataReady(true);
            self.dataFiltered(true);
            self.dataFetched(true);
        });
        self.backClick = function () {
            params.baseModel.registerComponent("categories", "configuration");
            self.configComponentName("categories");
        };
        var componentToLoad = {
            baseconfigurations: "base-configurations",
            dmsconfigurations: "monitoring-service"
        };
        self.showProperty = function (data) {
            ko.tasks.runEarly();
            self.showPropertyDiv(true);
            params.rootModel.categoryValue(data.categoryId);
            params.baseModel.registerComponent(componentToLoad[data.tableName], "configurations");
            self.propertyComponent(componentToLoad[data.tableName]);
        };
        self.refreshDom = function () {
            self.listDataReady(false);
            self.listDataReady(true);
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
            ListCategoryModel.getFilterCategoriesList(self.categoryType(), self.configValue()).done(function (data) {
                self.listDataReady(false);
                self.dataFiltered(false);
                self.categories(data.categoryList);
                self.dataSource = new oj.ArrayPagingDataSource(self.categories());
                self.categories(self.dataSource.getWindowObservable());
                self.listDataReady(true);
                self.dataFiltered(true);
            });
        };
        self.filteredCategories = ko.computed(function () {
            var filter = self.configValue();
            if (filter.length >= 0 && !self.pristine()) {
                self.dataFiltered(false);
            } else {
                self.dataFiltered(true);
            }
            return ko.utils.arrayFilter(self.originalCategories(), function (item) {
                return item.categoryId.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
            });
        });
        self.filteredCategories.subscribe(function (newValue) {
            self.pristine(false);
            self.listDataReady(false);
            self.categories(newValue);
            self.dataSource = new oj.ArrayPagingDataSource(self.categories());
            self.categories(self.dataSource.getWindowObservable());
            self.listDataReady(true);
            self.dataFiltered(true);
        });
        this.optionChangedHandler = function (event) {
            if (event.detail.value) {
                self.compData.removeAll();
                ko.tasks.runEarly();
                self.showPropertyDiv(false);
                self.propertyComponent("baseconfiguration");
                self.compData.push({
                    categoryId: self.selectedValue().toString().split(",")[0],
                    tableName: self.selectedValue().toString().split(",")[1]
                });
                self.showProperty(self.compData()[0]);
            }
        };
        self.dispose = function () {
            self.filteredCategories.dispose();
        };
    };
});
