define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/spend-category-edit",
    "promise",
    "ojs/ojinputnumber",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojbutton"
], function(oj, ko, $, SpendCategoyModel, ResourceBundle) {
    "use strict";
    return function(Params) {
        var self = this,
            i = 0,
            getspendCategoryDTO = function() {
                var KoModel = ko.mapping.fromJS(SpendCategoyModel.getNewModel());
                return KoModel.spendCategoryDTO;
            };
        ko.utils.extend(self, Params.rootModel);
        self.spendCategoryDetails = ko.observable(Params.data);
        self.resource = ResourceBundle.resource;
        self.validationTracker = ko.observable();
                self.categoryCode = ko.observable(self.spendCategoryDetails().code);
        self.categoryName = ko.observable(self.spendCategoryDetails().categoryName);
        self.categoryId = ko.observable(self.spendCategoryDetails().categoryId);
        self.subCategoryArray = ko.observableArray(self.spendCategoryDetails().subcategoriesArray());
        self.stageOne = ko.observable(true);
        if (self.subCategoryArray().length !== 0) {
            for (i = 0; i < self.subCategoryArray().length; i++) {
                self.subCategoryArray()[i].isOld = true;
            }
        }
        self.deleteSub = function(data) {
            self.subCategoryArray.remove(data);
        };
        self.addSub = function() {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.subCategoryArray.push({
                code: "",
                name: ko.observable(),
                isOld: false
            });
            ko.tasks.runEarly();
            var div = document.getElementById("edit-subcategory-container");
            div.scrollTop = div.scrollHeight;
        };
        self.editCategory = function() {
            if (!Params.baseModel.showComponentValidationErrors(document.getElementById("spendEditTracker"))) {
                return;
            }
            self.subCategoryArray.remove(function(subCategoryArray) {
                return subCategoryArray.code === "" && subCategoryArray.name === "";
            });
            self.spendCategoryDetails({
                code: self.categoryCode(),
                name: self.categoryName(),
                subCategoryList: self.subCategoryArray()
            });
            self.confirmEditCategory();
        };
        self.confirmEditCategory = function() {
            var spendCategoryDTO = getspendCategoryDTO();
            spendCategoryDTO.code(self.categoryCode());
            spendCategoryDTO.name(self.categoryName());
            spendCategoryDTO.description(self.categoryName());
            spendCategoryDTO.categoryId(self.categoryId());
            for (i = 0; i < self.subCategoryArray().length; i++) {
                spendCategoryDTO.subCategoryList().push({
                    code: self.subCategoryArray()[i].name,
                    name: self.subCategoryArray()[i].name,
                    description: self.subCategoryArray()[i].name,
                    categoryId: self.subCategoryArray()[i].categoryId ? self.subCategoryArray()[i].categoryId : null,
                    contentId: null,
                    subCategoryList: null
                });
            }
            var payload = ko.toJSON(spendCategoryDTO);
            SpendCategoyModel.editCategory(payload, self.categoryId()).done(function() {
                self.listcategories();
                self.requestSuccessful(true);
                self.closeModalWindow();
            });
        };
    };
});