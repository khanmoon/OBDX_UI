define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model",
    "ojL10n!resources/nls/biller-category",
    "ojs/ojinputtext",
    "promise",
    "ojs/ojlistview",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojinputnumber",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojlistview",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource"
], function (oj, ko, $, BaseLogger, BillerCategoryLendingObject, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, url, BillerCategoryLending = new BillerCategoryLendingObject(), firstTime = true;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.billerCategory = ko.observable();
        self.billerName = ko.observable();
        self.mappingListLoaded = ko.observable(false);
        self.categoriesLoaded = ko.observable(true);
        self.isLanding = ko.observable(true);
        self.refreshTable = ko.observable(true);
        self.isEdit = ko.observable(false);
        self.billerCategoryMappingLIst = ko.observableArray([]);
        self.billerCategoryList = ko.observableArray([]);
        self.mappedObject = ko.observableArray([]);
        self.sortedBillerCategoryRel = ko.observableArray([]);
        self.invalidTracker = ko.observable();
        self.categoryDetailsDataSource = ko.observable(null);
        url = "payments/billers?categoryType=ALL";
        rootParams.baseModel.registerComponent("biller-category-inquire", "biller");
        rootParams.baseModel.registerComponent("biller-category-maintenance", "biller");
        rootParams.baseModel.registerComponent("biller-category-add", "biller");
        rootParams.dashboard.headerName(self.resource.header.lending);
        rootParams.dashboard.headerCaption("");
        self.fetchBillerCategoryList = function () {
            if (firstTime) {
                BillerCategoryLending.fetchBillerCategoryList().done(function (data) {
                    self.categoriesLoaded(false);
                    self.billerCategoryList(data.categories);
                    ko.tasks.runEarly();
                    self.categoriesLoaded(true);
                    self.createMap();
                });
            } else {
                self.createMap();
            }
        };
        self.refreshInfo = function () {
            self.refreshTable(false);
            ko.tasks.runEarly();
            self.refreshTable(true);
        };
        self.editBiller = function () {
            self.isLanding(false);
            self.isEdit(true);
            self.refreshInfo();
        };
        self.cancel = function () {
            self.isLanding(true);
            self.mappingListLoaded(false);
            self.isEdit(false);
        };
        var selectedBiller;
        self.billerDescription = ko.observable();
        self.deleteBiller = function (billerId) {
            if ($("#deleteBiller").css("display") === "none") {
                selectedBiller = ko.utils.arrayFirst(self.mappedObject()[0].billers, function (element) {
                    return element.id === billerId;
                });
                self.billerDescription(selectedBiller.description);
                $("#deleteBiller").trigger("openModal");
            } else {
                BillerCategoryLending.deleteBiller(selectedBiller).done(function () {
                    $("#deleteBiller").hide();
                    self.mappingListLoaded(false);
                    ko.utils.arrayRemoveItem(self.mappedObject()[0].billers, selectedBiller);
                    ko.utils.arrayRemoveItem(self.billerCategoryMappingLIst(), ko.utils.arrayFirst(self.billerCategoryMappingLIst(), function (element) {
                        return element.id === selectedBiller.id;
                    }));
                    ko.tasks.runEarly();
                    self.mappingListLoaded(true);
                    self.categoryDetailsDataSource(new oj.ArrayTableDataSource(self.billerCategoryMappingLIst() || [], { idAttribute: ["id"] }));
                });
            }
        };
        self.cancelDeleteBiller = function () {
            $("#delete-biller").hide();
            self.mappingListLoaded(false);
            self.refreshInfo();
            self.mappingListLoaded(true);
        };
        self.fetchBillerCategoryMappingLIst = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }
            self.mappingListLoaded(false);
            BillerCategoryLending.fetchBillerCategoryMappingLIst(url).done(function (data) {
                self.categoryDetailsDataSource(null);
                self.billerCategoryMappingLIst(data.billers);
                self.fetchBillerCategoryList();
                self.categoryDetailsDataSource(new oj.ArrayTableDataSource(self.billerCategoryMappingLIst() || [], { idAttribute: ["id"] }));
            });
        };
        self.fetchBillerCategoryMappingLIst();
        var landing = true;
        self.createMap = function () {
            self.mappedObject([]);
            for (var i = 0; i < self.billerCategoryList().length; i++) {
                var filter = self.billerCategoryList()[i].categoryId.toLowerCase();
                var filteredItems = ko.utils.arrayFilter(self.billerCategoryMappingLIst(), function (item) {
                    return item.categoryType.toLowerCase() === filter;
                });
                if (filteredItems.length > 0) {
                    self.mappedObject.push({
                        category: self.billerCategoryList()[i].name,
                        billers: filteredItems,
                        categoryCode: self.billerCategoryList()[i].categoryId
                    });
                }
            }
            self.mappedObject.sort(function (left, right) {
                return left.description === right.description ? 0 : left.description < right.description ? -1 : 1;
            });
            if (landing) {
                landing = !landing;
            } else {
                self.mappingListLoaded(true);
            }
            if (firstTime) {
                self.sortedBillerCategoryRel(self.mappedObject());
                firstTime = false;
            }
        };
        self.filterBillerCategoryMap = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("categoryTracker"))) {
                return;
            }
            url = "payments/billers?categoryType=" + self.billerCategory();
            self.fetchBillerCategoryMappingLIst();
        };
    };
});