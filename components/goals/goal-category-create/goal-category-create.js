define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "ojL10n!resources/nls/goal-category-create",
    "./model",

    "ojs/ojbutton",
    "ojs/ojdatetimepicker",
    "ojs/ojdialog",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojarraytabledatasource",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojcheckboxset"
], function (ko, $, oj, ResourceBundle, goalCategoryCreateModel) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(goalCategoryCreateModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        var d = rootParams.baseModel.getDate();
        d.setDate(d.getDate() + 1);
        self.minDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.setHours(0, 0, 0, 0))));
        self.file = ko.observable();
        self.preview = ko.observable();
        self.validationTracker = ko.observable();
        self.validationTracker1 = ko.observable();
        self.goal = ResourceBundle.goal;
        self.common = ResourceBundle.common;
        self.contentId = ko.observable();
        self.productsFetched = ko.observable(false);
        self.productSelected = ko.observable(false);
        self.isRead = ko.observable(false);
        self.isCreate = ko.observable(true);
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.interestSlabsLoaded = ko.observable(false);
        self.isImageExist = ko.observable(false);
        self.categoryDetails = ko.observable({
            categoryCode: null,
            categoryName: null,
            categoryExpiryDate: null
        });
        rootParams.dashboard.headerName(self.goal.category.createTitle);
        self.productList = ko.observableArray();
        self.productId = ko.observable("");
        self.productName = ko.observable();
        self.productDetails = ko.observable("test");
        self.header = ko.observable(self.goal.category.create);
        self.subCategoriesList = ko.observableArray([getNewKoModel().goalCategoryModel]);
        self.interestSlabsDataSource = ko.observable(null);
        self.selectedAmountRange = ko.observable();
        self.fileId = ko.observable(self.goal.fileId);
        self.imageId = ko.observable(self.goal.imageId);
        self.amountRangeList = ko.observableArray();
        rootParams.baseModel.registerElement([
            "page-section",
            "confirm-screen",
            "modal-window"
        ]);
        rootParams.baseModel.registerComponent("image-upload", "goals");
        self.deleteSub = function (data) {
            self.subCategoriesList.remove(data);
        };
        self.addSub = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker1())) {
                return;
            }
            self.subCategoriesList.push(getNewKoModel().goalCategoryModel);
        };
        self.getHostDate = function () {
            var date = rootParams.baseModel.getDate();
            self.currentDate(rootParams.baseModel.formatDate(date));
        };
        self.categoryPayload = getNewKoModel().goalCategoryModel;
        self.subCategoryPayload = getNewKoModel().goalCategoryModel;
        self.fetchProducts = function () {
            goalCategoryCreateModel.getProducts().done(function (data) {
                self.productList.removeAll();
                for (var i = 0; i < data.goalProductDTOList.length; i++) {
                    self.productList.push({
                        id: data.goalProductDTOList[i].productId,
                        name: data.goalProductDTOList[i].productName,
                        initialFunding: rootParams.baseModel.format(self.goal.initialFunding, {
                            minAmount: data.goalProductDTOList[i].goalAmountParameters[0].minAmount.amount,
                            maxAmount: data.goalProductDTOList[i].goalAmountParameters[0].maxAmount.amount
                        }),
                        tenure: rootParams.baseModel.format(self.goal.tenure, {
                            minTenure: data.goalProductDTOList[i].goalTenureParameter.minTenure.years,
                            maxTenure: data.goalProductDTOList[i].goalTenureParameter.maxTenure.years
                        }),
                        currency: data.goalProductDTOList[i].goalAmountParameters[0].currency,
                        interestRate: null,
                        topUpAllowed: data.goalProductDTOList[i].goalFacilityParameter.isTopupAllowed,
                        topUpLimit: null,
                        partialAllowed: data.goalProductDTOList[i].goalFacilityParameter.isPartialRedeemAllowed,
                        partialPenalty: null
                    });
                }
            });
        };
        self.fetchProducts();
        self.productId.subscribe(function (data) {
            for (var j = 0; j < self.productList().length; j++) {
                if (data === self.productList()[j].id) {
                    self.productDetails({
                        product: {
                            initialFunding: self.productList()[j].initialFunding,
                            tenure: self.productList()[j].tenure,
                            currency: self.productList()[j].currency,
                            interestRate: self.productList()[j].interestRate,
                            topUpAllowed: self.productList()[j].topUpAllowed ? "OPTION_YES" : "OPTION_NO",
                            topUpLimit: self.productList()[j].topUpLimit,
                            partialAllowed: self.productList()[j].partialAllowed ? "OPTION_YES" : "OPTION_NO",
                            partialPenalty: self.productList()[j].partialPenalty
                        }
                    });
                    self.productSelected(true);
                    break;
                }
            }
        });
        self.uploadImage = function () {
            var form = new FormData();
            form.append("file", self.file());
            form.append("isShared", "true");
            goalCategoryCreateModel.uploadImage(form).done(function (data) {
                if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                    self.contentId(data.contentDTOList[0].contentId.value);
                    self.confirmAddCategory();
                }
            });
        };
        self.loadImage = function () {
            $().ready(function () {
                if (self.preview()) {
                    $("#"+self.imageId()).attr("src", self.preview());
                }
            });
        };
        self.addCategory = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("goalCreateTracker"))) {
                return;
            }
            if (document.getElementById(self.imageId()) === null) {
                rootParams.baseModel.showMessages(null, [self.common.uploadImage], "INFO");
                return;
            }
            for (var i = 0; i < self.productList().length; i++) {
                if (self.productId() === self.productList()[i].id) {
                    self.productName(self.productList()[i].name);
                    break;
                }
            }
            self.header(self.common.review);
            self.stageOne(false);
            self.stageTwo(true);
            self.isImageExist(true);
            ko.tasks.runEarly();
            setTimeout(self.loadImage, 300);
        };
        var payLoad;
        self.confirmAddCategory = function () {
            if (self.subCategoriesList().length === 1 && self.subCategoriesList()[0].categoryName() === null && self.subCategoriesList()[0].categoryCode() === null && self.subCategoriesList()[0].expiryDate() === null) {
                self.categoryPayload.subCategories = null;
            } else {
                self.categoryPayload.subCategories = self.subCategoriesList();
            }
            self.categoryPayload.categoryCode = self.categoryDetails().categoryCode;
            self.categoryPayload.categoryName = self.categoryDetails().categoryName;
            self.categoryPayload.expiryDate = self.categoryDetails().categoryExpiryDate;
            self.categoryPayload.productId = self.productId();
            self.categoryPayload.contentId = { value: self.contentId() };
            payLoad = ko.toJSON(self.categoryPayload);
            goalCategoryCreateModel.createCategory(payLoad).done(function (data, status, jqXHR) {
                self.stageTwo(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.goal.category.createTitle,
                    template: "payments/confirm-screen-templates/goal-category-create"
                }, self);
            }).fail(function () {
                if (self.contentId()) {
                    goalCategoryCreateModel.deleteImage(self.contentId());
                    self.contentId("");
                }
            });
        };
        self.amountChangeHandler = function (event) {
            if (event.detail.value) {
                self.interestSlabsLoaded(false);
                var obj = ko.utils.arrayFirst(self.interestRateSlabsList(), function (element) {
                    return element.amount.amount.toString() === event.detail.value;
                });
                self.interestSlabsDataSource(new oj.ArrayTableDataSource(obj.interestSlabRateList));
                self.interestSlabsLoaded(true);
            }
        };
        self.interestRateSlabsList = ko.observableArray();
        self.previoueProductId = ko.observable();
        self.openInterestSlabs = function () {
            if (self.previoueProductId() !== self.productId()) {
                self.interestSlabsLoaded(false);
                goalCategoryCreateModel.readProduct(self.productId()).done(function (data) {
                    self.previoueProductId(self.productId());
                    var from = 0, to = 0;
                    self.interestRateSlabsList(data.goalProductDTO.goalAmountParameters[0].interestRate.slabs);
                    self.amountRangeList.removeAll();
                    for (var i = 0; i < self.interestRateSlabsList().length; i++) {
                        to = self.interestRateSlabsList()[i].amount.amount;
                        var fromtenure = rootParams.baseModel.format(self.goal.interestslab.months, { months: 0 }), totenure = "",interestSlabRateList=data.goalProductDTO.goalAmountParameters[0].interestRate.slabs[i].interestSlabRateList;
                        self.interestRateSlabsList()[i].interestSlabRateList = [];
                        for (var j = 0; j < interestSlabRateList.length; j++) {
                            var termSlab = interestSlabRateList[j];
                            if (termSlab.term.months !== 0) {
                            interestSlabRateList[j].rate = rootParams.baseModel.format(self.goal.interestslab.percent, { percent: termSlab.rate });
                            if (termSlab.term.months > 11) {
                                totenure = rootParams.baseModel.format(self.goal.interestslab.years, { years: Math.floor(termSlab.term.months / 12) }) + (termSlab.term.months % 12 > 0 ? rootParams.baseModel.format(self.goal.interestslab.months, { months: termSlab.term.months % 12 }) : "");
                                interestSlabRateList[j].range = rootParams.baseModel.format(self.goal.interestslab.fromtotenure, {
                                    from: fromtenure,
                                    to: totenure
                                });
                                fromtenure = totenure;
                            } else {
                                totenure = rootParams.baseModel.format(self.goal.interestslab.months, { months: termSlab.term.months });
                                interestSlabRateList[j].range = rootParams.baseModel.format(self.goal.interestslab.fromtotenure, {
                                    from: fromtenure,
                                    to: totenure
                                });
                                fromtenure = totenure;
                            }
                            self.interestRateSlabsList()[i].interestSlabRateList.push(interestSlabRateList[j]);
                        }
                        }
                        self.amountRangeList.push({
                            text: i === self.interestRateSlabsList().length - 1 ? rootParams.baseModel.format(self.goal.interestslab.andabove, { value: from + 1 }) : rootParams.baseModel.format(self.goal.interestslab.fromto, {
                                from: from + 1,
                                to: to
                            }),
                            value: to.toString()
                        });
                        from = to;
                    }
                    self.selectedAmountRange(self.interestRateSlabsList()[0].amount.amount.toString());
                    self.interestSlabsDataSource(new oj.ArrayTableDataSource(self.interestRateSlabsList()[0].interestSlabRateList));
                    ko.tasks.runEarly();
                    self.interestSlabsLoaded(true);
                    $("#intrestslabs").trigger("openModal");
                });
            } else {
                $("#intrestslabs").trigger("openModal");
            }
        };
        self.closeModelWindow = function () {
            $("#intrestslabs").hide();
        };
        $(window).on("hashchange", function () {
            if (location.hash === "") {
                self.stageOne(true);
                self.stageTwo(false);
            }
        });
        self.backReview = function () {
            self.header(self.goal.category.create);
            self.stageOne(true);
            self.stageTwo(false);
            setTimeout(self.loadImage, 300);
        };
        self.back = function () {
            history.back(-1);
        };
    };
});