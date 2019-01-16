define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/biller-category-maintenance",
    "ojs/ojbutton",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojlistview",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, billerCategoryMaintenanceModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, id = 0, count = 0;
        ko.utils.extend(self, rootParams.rootModel);
        self.previousData = ko.observable(self);
        self.resource = ResourceBundle;
        self.addCategiriseList = ko.observableArray();
        self.billerCategoryArray = ko.observableArray();
        self.billerarray = ko.observableArray();
        self.loadTable = ko.observable(false);
        self.maintainedCategories = ko.observableArray();
        self.categoryId = ko.observable();
        self.invalidTracker = ko.observable();
        self.addedCategories = ko.observable("");
        self.isSave = ko.observable(false);
        self.scroll = ko.observable(false);
        self.categoryDataSource = ko.observable();
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.dashboard.headerName(self.resource.billerCategory.categorytitle);
        rootParams.dashboard.headerCaption("");
        self.removeCategoryFromMaintained = function (categoryId) {
            self.maintainedCategories.remove(function (maintainedCategories) {
                return maintainedCategories.categoryId === categoryId;
            });
        };
        self.mappedBillerCategories = function () {
            self.maintainedCategories(self.previousData().billerCategoryList());
            var mappedObject = self.previousData().sortedBillerCategoryRel();
            for (var i = 0; i < mappedObject.length; i++) {
                self.removeCategoryFromMaintained(mappedObject.categoryCode);
                mappedObject[i].id = id++;
                mappedObject[i].isNew = false;
            }
            self.addCategoryWithZeroBiller(mappedObject);
        };
        self.addcategoryButtonPosition = function () {
            self.scroll(document.documentElement.scrollHeight !== document.documentElement.clientHeight);
        };
        self.addCategoryWithZeroBiller = function (mappedObject) {
            for (var j = 0; j < self.maintainedCategories().length; j++) {
                if (mappedObject.length > 0) {
                    for (var k = 0; k < mappedObject.length; k++) {
                        if (self.maintainedCategories()[j].categoryId === mappedObject[k].categoryCode) {
                            break;
                        } else if (k === mappedObject.length - 1) {
                            mappedObject.push({
                                category: self.maintainedCategories()[j].categoryId,
                                billers: [],
                                categoryCode: self.maintainedCategories()[j].categoryId,
                                id: id++,
                                isNew: false
                            });
                        }
                    }
                } else {
                    mappedObject.push({
                        category: self.maintainedCategories()[j].categoryId,
                        billers: [],
                        categoryCode: self.maintainedCategories()[j].categoryId,
                        id: id++,
                        isNew: false
                    });
                }
            }
            self.billerCategoryArray(mappedObject);
            self.categoryDataSource(new oj.ArrayTableDataSource(self.billerCategoryArray() || []));
            self.loadTable(true);
            count = id;
        };
        self.mappedBillerCategories();
        self.addNewRow = function () {
            self.billerCategoryArray.push({
                category: ko.observable(),
                billers: false,
                categoryCode: "",
                id: id++,
                isNew: true
            });
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            self.isSave(true);
            self.categoryDataSource(new oj.ArrayTableDataSource(self.billerCategoryArray() || []));
        };
        self.addCategories = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                return;
            }
            if (count < self.billerCategoryArray().length) {
                for (var l = count; l < self.billerCategoryArray().length; l++) {
                    self.addCategiriseList.push({
                        categoryId: self.billerCategoryArray()[l].category(),
                        name: self.billerCategoryArray()[l].category()
                    });
                }
                if (self.billerCategoryArray().length - count > 1) {
                    self.addedCategories(self.resource.billerCategory.multiplebillercategorymsg);
                } else if (self.billerCategoryArray().length - count === 1) {
                    self.addedCategories(self.resource.billerCategory.singlebillercategorymsg);
                }
                billerCategoryMaintenanceModel.addCategories(ko.toJSON({ billerCategoryList: self.addCategiriseList() })).done(function (data, status, jqXHR) {
                    self.loadTable(false);
                    rootParams.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.resource.billerCategory.categorytitle,
                        template: "payments/confirm-screen-templates/biller-category-maintenance"
                    }, self);
                }).fail(function () {
                    self.addCategiriseList.removeAll();
                    self.addedCategories("");
                });
            }
        };
        self.confirmDelete = function (data) {
            self.categoryId(data.category);
            $("#deleteCategory").trigger("openModal");
        };
        self.deleteCategory = function () {
            $("#deleteCategory").hide();
            billerCategoryMaintenanceModel.deleteCategory(self.categoryId()).done(function () {
                self.removeCategory();
                self.addcategoryButtonPosition();
            });
        };
        self.cancelDeleteCategory = function () {
            $("#deleteCategory").hide();
        };
        self.removeCategory = function (event) {
            if (event) {
                self.billerCategoryArray.remove(function (billerCategoryArray) {
                    return billerCategoryArray.id === event.id;
                });
                if (count === self.billerCategoryArray().length) {
                    self.isSave(false);
                }
                self.addcategoryButtonPosition();
            } else {
                self.billerCategoryArray.remove(function (billerCategoryArray) {
                    return billerCategoryArray.category === self.categoryId();
                });
                count--;
            }
            self.categoryDataSource(new oj.ArrayTableDataSource(self.billerCategoryArray() || []));
        };
        self.goBack = function () {
            history.go(-1);
        };
        self.cancel = function () {
            if (count < self.billerCategoryArray().length) {
                for (var i = count; i < self.billerCategoryArray().length; i++) {
                    self.billerCategoryArray.remove(function (billerCategoryArray) {
                        return billerCategoryArray.category === self.billerCategoryArray()[i].category;
                    });
                }
            }
            rootParams.dashboard.openDashBoard(self.resource.billerCategory.cancelConfirm);
        };
    };
});