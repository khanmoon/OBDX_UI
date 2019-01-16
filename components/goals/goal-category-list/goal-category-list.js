define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "ojL10n!resources/nls/goal-category-list",
    "./model",

    "ojs/ojbutton",
    "ojs/ojdialog",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset"
], function (ko, $, oj, ResourceBundle, goalCategoryListModel) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.goal = ResourceBundle.goal;
        self.common = ResourceBundle.common;
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        rootParams.dashboard.headerName(self.goal.category.searchTitle);
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerComponent("goal-category-create", "goals");
        rootParams.baseModel.registerComponent("goal-category-view", "goals");
        self.searchData = ko.observable("");
        self.goalCode = ko.observable();
        self.goalCategory = ko.observable();
        self.reset = function () {
            self.stageOne(true);
            self.stageTwo(false);
            self.goalCode(null);
            self.goalCategory(null);
        };
        self.cancelSearch = function () {
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.searchGoals = function () {
            self.stageTwo(false);
            goalCategoryListModel.getCategoryList(self.goalCategory(), self.goalCode(), null).done(function (data) {
                var array = [];
                if (data.goalCategories) {
                    self.searchData(data.goalCategories);
                    array = $.map(self.searchData(), function (u) {
                        var obj = {
                            "goalCode": u.categoryCode ? u.categoryCode : "-",
                            "goalCategory": u.categoryName ? u.categoryName : "-",
                            "categoryId": u.categoryId ? u.categoryId : "",
                            "productCode": u.productId ? u.productId : "-",
                            "productType": u.productType ? u.productType : "-",
                            "productName": u.productName ? u.productName : "-",
                            "contentId": u.contentId ? u.contentId : "-",
                            "status": u.status ? self.goal.category.statusArray[u.status] : "-"
                        };
                        return obj;
                    });
                }
                function SortByDate(a, b) {
                    var aName = a.goalCategory;
                    var bName = b.goalCategory;
                    return aName < bName ? -1 : aName > bName ? 1 : 0;
                }
                array.sort(SortByDate);
                self.dataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array), { idAttribute: "goalCategory" });
                self.stageTwo(true);
            });
        };
        self.back = function () {
            history.back();
        };
    };
});