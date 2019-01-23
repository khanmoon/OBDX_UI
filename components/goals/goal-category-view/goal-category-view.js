define([
    "knockout",
    "jquery",
    "ojs/ojcore",
    "ojL10n!resources/nls/goal-category-view",
    "./model",

    "ojs/ojbutton",
    "ojs/ojdialog",
    "ojs/ojdatetimepicker",
    "ojs/ojselectcombobox",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojarraytabledatasource",
    "ojs/ojcheckboxset"
], function (ko, $, oj, ResourceBundle, goalCategoryViewModel) {
    "use strict";
    return function (Params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(goalCategoryViewModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        var d = Params.baseModel.getDate();
        d.setDate(d.getDate() + 1);
        self.minDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(d.setHours(0, 0, 0, 0))));
        self.validationTracker = ko.observable();
        self.validationTracker1 = ko.observable();
        self.goal = ResourceBundle.goal;
        self.common = ResourceBundle.common;
        self.file = ko.observable();
        self.contentId = ko.observable();
        self.isImageExist = ko.observable(false);
        self.preview = ko.observable();
        self.productsFetched = ko.observable(false);
        self.productSelected = ko.observable(false);
        self.isRead = ko.observable(false);
        self.isCreate = ko.observable(false);
        self.stageOne = ko.observable(false);
        self.stageTwo = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.stageFour = ko.observable(false);
        Params.baseModel.registerComponent("image-upload", "goals");
        self.categoryDetails = ko.observable({
            categoryCode: null,
            categoryName: null,
            categoryExpiryDate: null,
            categoryId: null
        });
        Params.dashboard.headerName(self.goal.category.viewTitle);
        self.productList = ko.observableArray();
        self.productId = ko.observable("");
        self.productName = ko.observable();
        self.productDetails = ko.observable();
        self.header = ko.observable();
        self.dataSource = ko.observable();
        self.subCategoriesList = ko.observableArray([]);
        self.currentLength = ko.observable();
        self.interestSlabsLoaded = ko.observable(false);
        self.amountRangeList = ko.observableArray();
        self.selectedAmountRange = ko.observable();
        self.interestSlabsDataSource = ko.observable(null);
        self.categoryDetails().categoryId = ko.toJS(self.params.categoryId);
        self.fileId = ko.observable("input");
        self.imageId = ko.observable("target");
        Params.baseModel.registerElement([
            "page-section",
            "confirm-screen",
            "modal-window"
        ]);
        self.getHostDate = function () {
            var date = Params.baseModel.getDate();
            self.currentDate(Params.baseModel.formatDate(date));
        };
        self.categoryPayload = getNewKoModel().goalCategoryModel;
        self.subCategoryPayload = getNewKoModel().goalCategoryModel;
        self.header(self.common.view);
        self.deleteSub = function (data) {
            self.subCategoriesList.remove(data);
        };
        self.addSub = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker1())) {
                return;
            }
            self.subCategoriesList.push(getNewKoModel().goalCategoryModel);
        };
        self.fetchProducts = function () {
            goalCategoryViewModel.getProducts().done(function (data) {
                self.productList.removeAll();
                for (var i = 0; i < data.goalProductDTOList.length; i++) {
                    self.productList.push({
                        id: data.goalProductDTOList[i].productId,
                        name: data.goalProductDTOList[i].productName,
                        initialFunding: Params.baseModel.format(self.goal.initialFunding, {
                            minAmount: data.goalProductDTOList[i].goalAmountParameters[0].minAmount.amount,
                            maxAmount: data.goalProductDTOList[i].goalAmountParameters[0].maxAmount.amount
                        }),
                        tenure: Params.baseModel.format(self.goal.tenure, {
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
                self.getCategoryDetail();
            });
        };
        self.fetchProducts();
        self.loadImage = function () {
            $().ready(function () {
                if (self.preview()) {
                    $("#target").attr("src", self.preview());
                }
            });
        };
        self.retrieveImage = function () {
            goalCategoryViewModel.retrieveImage(self.categoryDetails().contentId.value).done(function (data) {
                if (data && data.contentDTOList[0]) {
                    self.preview("data:image/gif;base64," + data.contentDTOList[0].content);
                    setTimeout(self.loadImage(), 1000);
                    self.isImageExist(true);
                }
            });
        };
        self.getCategoryDetail = function () {
            goalCategoryViewModel.readCategory(self.categoryDetails().categoryId).done(function (data) {
                if (data.goalCategoryDetails) {
                    self.categoryDetails().categoryCode = data.goalCategoryDetails.categoryCode;
                    self.categoryDetails().categoryName = data.goalCategoryDetails.categoryName;
                    self.categoryDetails().categoryExpiryDate = data.goalCategoryDetails.expiryDate;
                    self.categoryDetails().contentId = { value: data.goalCategoryDetails.contentId ? data.goalCategoryDetails.contentId.value : null };
                    if (data.goalCategoryDetails.contentId && data.goalCategoryDetails.contentId.value) {
                        self.retrieveImage();
                    }
                    self.productId(data.goalCategoryDetails.productId);
                    var array = [];
                    self.isRead(true);
                    self.dataSource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array), { idAttribute: "subCategoryName" }));
                    self.stageOne(true);
                }
            });
        };
        self.remove = function () {
            $("#target").attr("src", "");
            self.isImageExist(false);
            self.contentId(null);
        };
        self.editCategory = function () {
            self.productSelected(true);
            Params.dashboard.headerName(self.goal.category.viewTitle);
            self.header(self.common.edit);
            self.stageOne(false);
            self.stageTwo(true);
            if (self.isImageExist()) {
                self.retrieveImage();
            }
        };
        self.uploadImage = function () {
            var form = new FormData();
            form.append("file", self.file());
            form.append("isShared", "true");
            goalCategoryViewModel.uploadImage(form).done(function (data) {
                if (data && data.contentDTOList[0] && data.contentDTOList[0].contentId) {
                    self.contentId(data.contentDTOList[0].contentId.value);
                    goalCategoryViewModel.deleteImage(self.categoryDetails().contentId.value);
                    self.isImageExist(true);
                    self.saveCategoryDetails();
                    setTimeout(self.loadImage(), 5000);
                }
            });
        };
        self.productId.subscribe(function (data) {

                for (var k = 0; k < self.productList().length; k++) {
                    if (data === self.productList()[k].id) {
                        self.productId(data);
                        self.productName(self.productList()[k].name);
                        self.productDetails({
                            product: {
                                initialFunding: self.productList()[k].initialFunding,
                                tenure: self.productList()[k].tenure,
                                currency: self.productList()[k].currency,
                                interestRate: self.productList()[k].interestRate,
                                topUpAllowed: self.productList()[k].topUpAllowed ? "OPTION_YES" : "OPTION_NO",
                                topUpLimit: self.productList()[k].topUpLimit,
                                partialAllowed: self.productList()[k].partialAllowed ? "OPTION_YES" : "OPTION_NO",
                                partialPenalty: self.productList()[k].partialPenalty
                            }
                        });
                        self.productSelected(true);
                        break;
                    }
                }

        });
        self.updateCategory = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (document.getElementById("target") === null) {
                Params.baseModel.showMessages(null, [self.common.uploadImage], "ERROR");
                return;
            }
            if (self.file()) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    self.preview(e.target.result);
                    self.isImageExist(true);
                    setTimeout(self.loadImage, 1000);
                };
                reader.readAsDataURL(self.file());
            } else {
                setTimeout(self.loadImage, 1000);
            }
            self.stageTwo(false);
            self.header(self.common.review);
            self.stageThree(true);
        };
        var payload;
        self.confirmCategory = function () {
            if (self.file()) {
                self.uploadImage();
            } else {
                self.saveCategoryDetails();
            }
        };
        self.saveCategoryDetails = function () {
            self.categoryPayload.categoryCode = self.categoryDetails().categoryCode;
            self.categoryPayload.categoryName = self.categoryDetails().categoryName;
            self.categoryPayload.productId = self.productId();
            self.categoryPayload.expiryDate = self.categoryDetails().categoryExpiryDate;
            self.categoryPayload.categoryId = self.categoryDetails().categoryId;
            self.categoryPayload.contentId = { value: self.contentId() || self.categoryDetails().contentId.value };
            for (var i = 0; i < self.subCategoriesList().length; i++) {
                self.subCategoriesList()[i].parentCategory = self.categoryDetails().categoryId;
            }
            if (self.subCategoriesList().length === 1 && self.subCategoriesList()[0].categoryName() === null && self.subCategoriesList()[0].categoryCode() === null && self.subCategoriesList()[0].expiryDate() === null) {
                self.categoryPayload.subCategories = null;
            } else {
                self.categoryPayload.subCategories = self.subCategoriesList();
            }
            payload = ko.toJSON(self.categoryPayload);
            goalCategoryViewModel.updateCategory(payload, self.categoryDetails().categoryId).done(function (data, status, jqXHR) {
                if (!self.stageTwo()) {
                    self.stageThree(false);
                    Params.dashboard.loadComponent("confirm-screen", {
                        jqXHR: jqXHR,
                        transactionName: self.goal.category.viewTitle,
                        template: "payments/confirm-screen-templates/goal-category-view"
                    }, self);
                }
            }).fail(function () {
                if (self.contentId()) {
                    goalCategoryViewModel.deleteImage(self.contentId());
                    self.contentId("");
                }
            });
        };
        self.done = function () {
            Params.dashboard.openDashBoard();
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
                goalCategoryViewModel.readProduct(self.productId()).done(function (data) {
                    self.previoueProductId(self.productId());
                    var from = 0, to = 0;
                    self.interestRateSlabsList(data.goalProductDTO.goalAmountParameters[0].interestRate.slabs);
                    self.amountRangeList.removeAll();
                    for (var i = 0; i < self.interestRateSlabsList().length; i++) {
                        to = self.interestRateSlabsList()[i].amount.amount;
                        var fromtenure = Params.baseModel.format(self.goal.interestslab.months, { months: 0 }), totenure = "",interestSlabRateList=data.goalProductDTO.goalAmountParameters[0].interestRate.slabs[i].interestSlabRateList;
                        self.interestRateSlabsList()[i].interestSlabRateList = [];
                        for (var j = 0; j < interestSlabRateList.length; j++) {
                            var termSlab = interestSlabRateList[j];
                            if (termSlab.term.months !== 0) {
                                interestSlabRateList[j].rate = Params.baseModel.format(self.goal.interestslab.percent, { percent: termSlab.rate });
                                if (termSlab.term.months > 11) {
                                    totenure = Params.baseModel.format(self.goal.interestslab.years, { years: Math.floor(termSlab.term.months / 12) }) + (termSlab.term.months % 12 > 0 ? Params.baseModel.format(self.goal.interestslab.months, { months: termSlab.term.months % 12 }) : "");
                                    interestSlabRateList[j].range = Params.baseModel.format(self.goal.interestslab.fromtotenure, {
                                        from: fromtenure,
                                        to: totenure
                                    });
                                    fromtenure = totenure;
                                } else {
                                    totenure = Params.baseModel.format(self.goal.interestslab.months, { months: termSlab.term.months });
                                    interestSlabRateList[j].range = Params.baseModel.format(self.goal.interestslab.fromtotenure, {
                                        from: fromtenure,
                                        to: totenure
                                    });
                                    fromtenure = totenure;
                                }
                                self.interestRateSlabsList()[i].interestSlabRateList.push(interestSlabRateList[j]);
                            }
                        }
                        self.amountRangeList.push({
                            text: i === self.interestRateSlabsList().length - 1 ? Params.baseModel.format(self.goal.interestslab.andabove, { value: from + 1 }) : Params.baseModel.format(self.goal.interestslab.fromto, {
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
        self.backReview = function () {
            self.header(self.common.edit);
            self.stageThree(false);
            self.stageTwo(true);
            setTimeout(self.loadImage, 1000);
        };
        self.back = function () {
            history.back();
        };
        self.backEdit = function () {
            self.header(self.common.view);
            self.stageOne(true);
            setTimeout(self.loadImage, 1000);
            self.stageTwo(false);
        };
    };
});
