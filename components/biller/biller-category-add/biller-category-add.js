define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/biller-category",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojtable",
    "ojs/ojarraytabledatasource"
], function (oj, ko, $, BillerCategoryaddObject, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, billermap = {}, BillerCategoryadd = new BillerCategoryaddObject();
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.billerCategory = ko.observable();
        self.refresh = ko.observable(false);
        self.reviewLoaded = ko.observable(false);
        self.selectedBillerCategory = ko.observable();
        self.mappingDataSource = ko.observable();
        self.availableBillers = ko.observableArray([]);
        self.availableBillerslist = ko.observableArray([]);
        self.invalidTracker = ko.observable();
        self.categoriesList = ko.observableArray([]);
        self.categoriesLoaded = ko.observable(false);
        rootParams.dashboard.headerName(self.resource.header.mapBiller);
        rootParams.dashboard.headerCaption("");
        rootParams.baseModel.registerElement("confirm-screen");
        var getNewKoModel = function (id, desc, category) {
            var billercategorymodel = ko.mapping.fromJS(BillerCategoryadd.getNewModel()).billercategorymodel;
            billercategorymodel.billerId(id);
            billercategorymodel.billerDescription(desc);
            billercategorymodel.categoryType(category);
            return billercategorymodel;
        };
        $.when(BillerCategoryadd.fetchBillerCategoryList(), BillerCategoryadd.fetchBiller(), BillerCategoryadd.fetchBillerCategoryMapping()).then(function (categoryData, billerData, billerCategoryMapping) {
            self.categoriesList(categoryData.categories);
            billerData.billers.sort(function (left, right) {
                return left.id === right.id ? 0 : left.id < right.id ? -1 : 1;
            });
            billerCategoryMapping.billers.sort(function (left, right) {
                return left.id === right.id ? 0 : left.id < right.id ? -1 : 1;
            });
            for (var i = 0; i < billerData.billers.length; i++) {
                billermap[billerData.billers[i].id] = billerData.billers[i].name;
                for (var j = 0; j < billerCategoryMapping.billers.length; j++) {
                    if (billerData.billers[i].id === billerCategoryMapping.billers[j].id) {
                        delete billermap[billerData.billers[i].id];
                        billerData.billers.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            self.availableBillers(billerData.billers);
            self.categoriesLoaded(true);
        });
        self.categoryChangeHandler = function (event) {
            if (event.detail.trigger && self.availableBillerslist().length === 0) {
                self.availableBillerslist.push({
                    selectedBiller: ko.observable(),
                    availableOptions: self.availableBillers()
                });
                self.mappingDataSource(new oj.ArrayTableDataSource(self.availableBillerslist()));
                self.reload();
            }
        };
        self.billerCodeChangeHandler = function (event) {
            if (event.detail.trigger) {
                for (var k = 0; k < self.availableBillerslist().length; k++) {
                    var selectedBiller = self.availableBillerslist()[k].selectedBiller();
                    self.availableBillerslist()[k].availableOptions = self.availableBillers().filter(function (a) {
                        if (selectedBiller === a.id)
                            return true;
                        var matched = false;
                        for (var i = 0; i < self.availableBillerslist().length; i++) {
                            matched = a.id === self.availableBillerslist()[i].selectedBiller();
                            if (matched)
                                break;
                        }
                        return !matched;
                    });
                }
                self.mappingDataSource(new oj.ArrayTableDataSource(self.availableBillerslist()));
                self.reload();
            }
        };
        self.addBiller = function () {
            self.availableBillerslist.push({
                selectedBiller: ko.observable(),
                availableOptions: self.availableBillers().filter(function (a) {
                    var matched = false;
                    for (var i = 0; i < self.availableBillerslist().length; i++) {
                        matched = a.id === self.availableBillerslist()[i].selectedBiller();
                        if (matched)
                            break;
                    }
                    return !matched;
                })
            });
            self.mappingDataSource(new oj.ArrayTableDataSource(self.availableBillerslist()));
            self.reload();
        };
        self.removeBiller = function (item) {
            if (item.selectedBiller()) {
                var removedBiller = {
                    name: billermap[item.selectedBiller()],
                    id: item.selectedBiller()
                };
                self.availableBillerslist.remove(function (biller) {
                    return biller.selectedBiller() === item.selectedBiller();
                });
                for (var i = 0; i < self.availableBillerslist().length; i++) {
                    self.availableBillerslist()[i].availableOptions.push(removedBiller);
                }
            } else {
                self.availableBillerslist.remove(function (biller) {
                    return biller.selectedBiller() === item.selectedBiller();
                });
            }
            self.mappingDataSource(new oj.ArrayTableDataSource(self.availableBillerslist()));
            self.reload();
        };
        self.review = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker()))
                return;
            self.selectedBillerCategory(ko.utils.arrayFirst(self.categoriesList(), function (element) {
                return element.categoryId === self.billerCategory();
            }).name);
            self.availableBillerslist.remove(function (biller) {
                return !biller.selectedBiller();
            });
            for (var i = 0; i < self.availableBillerslist().length; i++) {
                self.availableBillerslist()[i].billerId = self.availableBillerslist()[i].selectedBiller();
                self.availableBillerslist()[i].billerDescription = billermap[self.availableBillerslist()[i].selectedBiller()];
            }
            self.mappingDataSource(new oj.ArrayTableDataSource(self.availableBillerslist()));
            self.reviewLoaded(true);
        };
        self.mapBiller = function () {
            var payload = { billerCategoryRelationShipList: [] };
            for (var i = 0; i < self.availableBillerslist().length; i++)
                payload.billerCategoryRelationShipList.push(ko.mapping.toJS(getNewKoModel(self.availableBillerslist()[i].selectedBiller(), billermap[self.availableBillerslist()[i].selectedBiller()], self.billerCategory())));
            BillerCategoryadd.mapBiller(ko.toJSON(payload)).done(function (data, status, jqXHR) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.header.mapBiller
                }, self);
            });
        };
        self.back = function () {
            if (self.reviewLoaded())
                self.reviewLoaded(false);
            else
                history.back();
        };
        self.reload = function () {
            self.refresh(false);
            ko.tasks.runEarly();
            self.refresh(true);
        };
    };
});