define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/spend-category-create",
    "promise",
    "ojs/ojinputnumber",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojinputtext",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojbutton"
], function (oj, ko, $, SpendCategoyModel, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this, getspendCategoryDTO = function () {
                var KoModel = ko.mapping.fromJS(SpendCategoyModel.getNewModel());
                return KoModel.spendCategoryDTO;
            };
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle.resource;
        self.fromRecategorization = Params.data.recategorization || false;
        self.validationTracker = ko.observable();
        self.categoryCode = ko.observable();
        self.categoryName = ko.observable();
        self.subCategoryArray = ko.observableArray([]);
        Params.dashboard.headerName(self.resource.spendCategory.header);
        self.stageOne = ko.observable(true);
        self.spendCategoryDetails = ko.observable();
        self.subCategoryList = ko.observableArray();
        self.deleteSub = function (data) {
            self.subCategoryArray.remove(data);
        };
        self.addSub = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.subCategoryArray.push({
                code: "",
                name: ""
            });
            ko.tasks.runEarly();
            var div = document.getElementById("create-subcategory-container");
            div.scrollTop = div.scrollHeight;
        };
        self.addCategory = function () {
             var createSubCategoryTracker = document.getElementById("createSubCategoryTracker");
                var createCategoryTracker = document.getElementById("createCategoryTracker");
                var createSubCategoryFailed = !Params.baseModel.showComponentValidationErrors(createSubCategoryTracker);
                var createCategoryFailed = !Params.baseModel.showComponentValidationErrors(createCategoryTracker);
            if(createSubCategoryTracker || createCategoryTracker){
             if ( createSubCategoryFailed || createCategoryFailed)
                 return;
            }
            self.subCategoryArray.remove(function (subCategoryArray) {
                return subCategoryArray.code === "" && subCategoryArray.name === "";
            });
            self.spendCategoryDetails({
                code: self.categoryCode(),
                name: self.categoryName()
            });
            self.confirmAddCategory();
        };
        self.confirmAddCategory = function () {
            var spendCategoryDTO = getspendCategoryDTO();
            spendCategoryDTO.code(self.categoryName() + "_U");
            spendCategoryDTO.name(self.categoryName());
            spendCategoryDTO.description(self.categoryName());
            for (var i = 0; i < self.subCategoryArray().length; i++) {
                spendCategoryDTO.subCategoryList().push({
                    code: self.subCategoryArray()[i].name,
                    name: self.subCategoryArray()[i].name,
                    description: self.subCategoryArray()[i].name,
                    contentId: null,
                    subCategoryList: null
                });
            }
            var payload = ko.toJSON(spendCategoryDTO);
            SpendCategoyModel.addCategory(payload).done(function () {
                self.listcategories();
                self.requestSuccessful(true);
                self.closeModalWindow();
            });
        };
    };
});