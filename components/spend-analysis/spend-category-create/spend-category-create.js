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
        Params.dashboard.headerName(self.resource.spendCategory.header);
        self.validationTracker = ko.observable();
        self.validationTracker1 = ko.observable();
        self.categoryCode = ko.observable();
        self.categoryName = ko.observable();
        self.subCategoryArray = ko.observableArray([{
                code: "",
                name: ""
            }]);
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
        self.subCategoryDataSource = ko.observable();
        self.spendCategoryDetails = ko.observable();
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
                name: ""
            });
        };
        self.addCategory = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            for (var i = 0; i < self.subCategoryArray().length; i++) {
                if ((self.subCategoryArray()[i].name === "" && self.subCategoryArray()[i].code !== "") ||( self.subCategoryArray()[i].name !== "" && self.subCategoryArray()[i].code === "")) {
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
                name: self.categoryName()
            });
            self.subCategoryDataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.subCategoryArray), { idAttribute: "name" }));
            self.stageOne(false);
            self.stageTwo(true);
        };
        self.backReview = function () {
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.confirmAddCategory = function () {
            var spendCategoryDTO = getspendCategoryDTO();
            spendCategoryDTO.code(self.categoryCode());
            spendCategoryDTO.name(self.categoryName());
            spendCategoryDTO.description(self.categoryName());
            for (var i = 0; i < self.subCategoryArray().length; i++) {
                spendCategoryDTO.subCategoryList().push({
                    code: self.subCategoryArray()[i].code,
                    name: self.subCategoryArray()[i].name,
                    description: self.subCategoryArray()[i].name,
                    contentId: null,
                    subCategoryList: null
                });
            }
            var payload = ko.toJSON(spendCategoryDTO);
            SpendCategoyModel.addCategory(payload).done(function (data, status, jqXHR) {
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.spendCategory.addCategoryConfirm,
                    template: "pfm/confirm-screen-templates/spend-category-create"
                }, self);
                self.stageOne(false);
                self.stageTwo(false);
            });
        };
    };
});