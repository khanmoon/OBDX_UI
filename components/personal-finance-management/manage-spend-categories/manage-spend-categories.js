define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/manage-spend-categories",
    "promise",
    "ojs/ojarraytabledatasource",
    "ojs/ojtable",
    "ojs/ojlistview"
], function (oj, ko, $, SpendCategories, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.spendCategoryList = ko.observableArray([]);
        self.loadTable = ko.observable(false);
        self.loadCreateTemplate = ko.observable(false);
        self.loadEditTemplate = ko.observable(false);
        self.requestSuccessful = ko.observable(false);
        self.categoryData = ko.observable();
        self.categoriesDataSource = ko.observable();
        Params.dashboard.headerName(self.resource.title);
        Params.baseModel.registerElement("modal-window");
        Params.baseModel.registerComponent("spend-category-create", "personal-finance-management");
        Params.baseModel.registerComponent("spend-category-edit", "personal-finance-management");
        Params.baseModel.registerComponent("user-spend-category-card", "personal-finance-management");
        var nameRegEx = /^[a-zA-Z0-9 \&\:\$\,\.\_]+$/;
        self.validateName = {
            validate: function (value) {
                if ((!nameRegEx.test(value) || value.length > 40) && value !== "") {
                    throw new oj.ValidatorError("", self.resource.spendCategory.errorMessage);
                }
                return true;
            }
        };
        self.getSubCategoriesNamesAsString = function (subcategoriesArray) {
            var subcategories = "";
            for (var i = 0; i < subcategoriesArray.length; i++) {
                if (i === subcategoriesArray.length - 1) {
                    subcategories = subcategories + subcategoriesArray[i].name;
                    return subcategories;
                }
                subcategories = subcategories + subcategoriesArray[i].name + ", ";
            }
        };
        self.back = function () {
            history.back();
        };
        self.listcategories = function () {
            SpendCategories.listcategories().done(function (data) {
                self.loadTable(false);
                self.spendCategoryList.removeAll();
                if (data.spendCategoryList) {
                    for (var i = 0; i < data.spendCategoryList.length; i++) {
                        if (!data.spendCategoryList[i].parentId && data.spendCategoryList[i].partyId.value !== null) {
                            self.spendCategoryList.push({
                                categoryId: data.spendCategoryList[i].categoryId,
                                code: data.spendCategoryList[i].code,
                                categoryName: data.spendCategoryList[i].name,
                                subcategories: data.spendCategoryList[i].subCategoryList ? self.getSubCategoriesNamesAsString(data.spendCategoryList[i].subCategoryList) : "",
                                subcategoriesArray: ko.observableArray(data.spendCategoryList[i].subCategoryList)
                            });
                        }
                    }
                }
                self.categoriesDataSource(new oj.ArrayTableDataSource(self.spendCategoryList(),{idAttribute : "categoryName"}) || []);
                ko.tasks.runEarly();
                self.loadTable(true);
            });
        };
        self.listcategories();
        self.createCategory = function () {
            self.requestSuccessful(false);
            self.loadEditTemplate(false);
            self.loadCreateTemplate(false);
            ko.tasks.runEarly();
            self.loadCreateTemplate(true);
            $("#managecategory").trigger("openModal");
        };
        self.closeModalWindow = function () {
            $("#managecategory").hide();
            $("#editSpendCategory").hide();
            self.listcategories();
        };
        self.edit = function (data) {
            self.categoryData(data);
            self.loadCreateTemplate(false);
            self.loadEditTemplate(false);
            self.requestSuccessful(false);
            ko.tasks.runEarly();
            self.loadEditTemplate(true);
            $("#editSpendCategory").trigger("openModal");
            ko.tasks.runEarly();
            var div1 = document.getElementById("edit-subcategory-container");
            if (div1 !== null) {
                div1.scrollTop = div1.scrollHeight;
            }
        };
        self.deletecategory = function (categoryData) {
            SpendCategories.deletecategory(categoryData.categoryId).done(function () {
                self.loadTable(false);
                self.spendCategoryList.remove(function (subCategoryArray) {
                    return categoryData.categoryId === subCategoryArray.categoryId;
                });
                self.categoriesDataSource(new oj.ArrayTableDataSource(self.spendCategoryList()));
                ko.tasks.runEarly();
                self.loadTable(true);
            });
        };
    };
});