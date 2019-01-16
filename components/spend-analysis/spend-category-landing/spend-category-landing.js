define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "ojL10n!resources/nls/spend-category-landing",
    "./model",

    "ojs/ojbutton",
    "ojs/ojdialog",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojselectcombobox",
    "ojs/ojcheckboxset"
], function (ko, $, oj, ResourceBundle, SpendCategoryLandingModel) {
    "use strict";
    return function (Params) {
        var self = this;
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.dataSource = ko.observableArray();
        self.spendCategoryList = ko.observableArray();
        self.spendCategoryDetails = ko.observable();
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle.resource;
        Params.dashboard.headerName(self.resource.spendCategory.title);
        self.validationTracker = ko.observable();
        self.categoryCode = ko.observable();
        self.categoryName = ko.observable();
        self.subCategoryList = ko.observableArray();
        Params.baseModel.registerComponent("spend-category-create", "spend-analysis");
        Params.baseModel.registerComponent("spend-category-edit", "spend-analysis");
        Params.baseModel.registerElement("help");
        var nameRegEx = /^[a-zA-Z0-9 \&\:\$\,\.\_]+$/;
        self.validateName = {
            validate: function (value) {
                if ((!nameRegEx.test(value) || value.length > 40) && value !== "") {
                    throw new oj.ValidatorError("", self.resource.spendCategory.errorMessage);
                }
                return true;
            }
        };
        self.viewScreenBack = function () {
            self.stageThree(false);
            self.stageOne(true);
            self.stageTwo(true);
        };
        self.reset = function () {
            self.categoryCode(null);
            self.categoryName(null);
            self.stageTwo(false);
            self.spendCategoryList.removeAll();
        };
        self.search = function () {
            self.stageTwo(false);
            self.spendCategoryList.removeAll();
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            SpendCategoryLandingModel.getSpendCategoryList(self.categoryName(), self.categoryCode()).done(function (data) {
                if (data.spendCategoryList) {
                    self.spendCategoryList(data.spendCategoryList);
                }
                $.map(self.spendCategoryList(), function (u) {
                    var obj = {
                        "name": u.name ? u.name : "-",
                        "code": u.code ? u.code : "-"
                    };
                    return obj;
                });
                self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.spendCategoryList), { idAttribute: "code" }));
                self.stageTwo(true);
            });
        };
        self.viewCategory = function (data) {
            self.subCategoryList.removeAll();
            self.spendCategoryDetails(data);
            SpendCategoryLandingModel.getSubCategoryList(data.categoryId).done(function (data1) {
                if (data1.spendCategoryDTO.subCategoryList) {
                    self.subCategoryList(data1.spendCategoryDTO.subCategoryList);
                }
                self.spendCategoryDetails(data1.spendCategoryDTO);
            });
            self.subCategoryDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.subCategoryList), { idAttribute: "name" });
            self.stageOne(false);
            self.stageTwo(false);
            self.stageThree(true);
        };
    };
});