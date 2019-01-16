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
    "ojs/ojbutton"
], function (oj, ko, $, SpendCategoyModel, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this, i = 0, getspendCategoryDTO = function () {
                var KoModel = ko.mapping.fromJS(SpendCategoyModel.getNewModel());
                return KoModel.spendCategoryDTO;
            };
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle.resource;
        Params.dashboard.headerName(self.resource.spendCategory.title);
        self.validationTracker = ko.observable();
        self.validationTracker1 = ko.observable();
        self.categoryCode = ko.observable(self.spendCategoryDetails().code);
        self.categoryName = ko.observable(self.spendCategoryDetails().name);
        self.categoryId = ko.observable(self.spendCategoryDetails().categoryId);
        self.subCategoryArray = ko.observableArray(self.spendCategoryDetails().subCategoryList);
        self.subCategoryArrayforTable = ko.observableArray();
        self.isRead = ko.observable(false);
        self.isCreate = ko.observable(true);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        Params.baseModel.registerElement([
            "confirm-screen",
            "modal-window",
            "action-header"
        ]);
        Params.baseModel.registerComponent("spend-category-landing", "spend-analysis");
        if (self.subCategoryArray().length !== 0) {
            for (i = 0; i < self.subCategoryArray().length; i++) {
                self.subCategoryArray()[i].isOld = true;
            }
        }
        self.subCategoryList = ko.observableArray();
        self.deleteSub = function (data) {
            self.subCategoryArray.remove(data);
        };
        self.addSub = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker1())) {
                return;
            }
            self.subCategoryArray.push({
                code: "",
                name: "",
                isOld: false
            });
        };
        self.editCategory = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            for (i = 0; i < self.subCategoryArray().length; i++) {
                if ((self.subCategoryArray()[i].name === "" && self.subCategoryArray()[i].code !== "") || (self.subCategoryArray()[i].name !== "" && self.subCategoryArray()[i].code === "")) {
                    if (!Params.baseModel.showComponentValidationErrors(self.validationTracker1())) {
                        return;
                    }
                }
            }
            self.subCategoryArray.remove(function (subCategoryArray) {
                return subCategoryArray.code === "" && subCategoryArray.name === "";
            });
            self.spendCategoryDetails({
                code: self.categoryCode(),
                name: self.categoryName(),
                subCategoryList: self.subCategoryArray()
            });
            for (i = 0; i < self.subCategoryArray().length; i++) {
                self.subCategoryArrayforTable().push({
                    code: self.subCategoryArray()[i].code,
                    name: self.subCategoryArray()[i].name
                });
            }
            self.subCategoryDataSource = new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.subCategoryArrayforTable), { idAttribute: "name" });
            self.stageOne(false);
            self.stageTwo(true);
        };
        self.backReview = function () {
            self.subCategoryArrayforTable.removeAll();
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.confirmEditCategory = function () {
            var spendCategoryDTO = getspendCategoryDTO();
            spendCategoryDTO.code(self.categoryCode());
            spendCategoryDTO.name(self.categoryName());
            spendCategoryDTO.description(self.categoryName());
            spendCategoryDTO.categoryId(self.categoryId());
            for (i = 0; i < self.subCategoryArray().length; i++) {
                spendCategoryDTO.subCategoryList().push({
                    code: self.subCategoryArray()[i].code,
                    name: self.subCategoryArray()[i].name,
                    description: self.subCategoryArray()[i].name,
                    categoryId: self.subCategoryArray()[i].categoryId ? self.subCategoryArray()[i].categoryId : null,
                    contentId: null,
                    subCategoryList: null
                });
            }
            var payload = ko.toJSON(spendCategoryDTO);
            SpendCategoyModel.editCategory(payload, self.categoryId()).done(function (data, status, jqXHR) {
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.spendCategory.editCategoryConfirm,
                    template: "pfm/confirm-screen-templates/spend-category-edit"
                }, self);
                self.stageOne(false);
                self.stageTwo(false);
            });
        };
    };
});