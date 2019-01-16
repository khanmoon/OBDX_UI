define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/goal-category-select",
    "framework/js/constants/constants",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext",
    "ojs/ojinputnumber"
], function (oj, ko, $, goalCalculatorSelectModel, BaseLogger, ResourceBundle, constants) {
    "use strict";
    return function (rootParams) {
        var self = this, payLoad = { batchDetailRequestList: [] }, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(goalCalculatorSelectModel.getNewModel());
                return KoModel;
            }, contentMap = {};
        ko.utils.extend(self, rootParams.rootModel);
        constants.module = "GOAL";
        self.isCalculationRequired = self.params.calculateGoal;
        self.loginRequired = self.params.loginRequired;
        self.validationTracker = ko.observable();
        self.categories = ko.observableArray();
        self.goal = ResourceBundle.goal;
        rootParams.dashboard.headerName(self.goal.category_title);
        rootParams.dashboard.headerCaption(null);
        self.isLoaded = ko.observable(false);
        self.subCategories = ko.observableArray();
        self.categoryName = ko.observable();
        self.title1 = ko.observable();
        self.transferObject = ko.observable(getNewKoModel().transferObject);
        rootParams.baseModel.registerElement([
            "row",
            "page-section",
            "amount-input",
            "action-header",
            "category-card"
        ]);
        rootParams.baseModel.registerComponent("create-goal", "goals");
        rootParams.baseModel.registerComponent("goal-calculator", "goals");
        rootParams.baseModel.registerComponent("goal-amount", "goals");
        self.actionCardClick = function (componentData) {
            self.transferObject().categoryId(componentData);
            for (var i = 0; i < self.categories().length; i++) {
                if (componentData === self.categories()[i].categoryId) {
                    self.transferObject().content(self.categories()[i].content);
                    goalCalculatorSelectModel.getProduct(self.categories()[i].productId).done(function (data) {
                        if (data.goalProductDTO) {
                            self.transferObject().productDetails(data.goalProductDTO);
                            self.transferObject().initialAmount(data.goalProductDTO.goalAmountParameters[0].minAmount.amount);
                            rootParams.dashboard.loadComponent("goal-amount", {
                                transferDTO: self.transferObject(),
                                isCalculationRequired: self.isCalculationRequired
                            }, self);
                        }
                    });
                    self.categoryName(self.categories()[i].categoryName.toLowerCase());
                    self.title1(rootParams.baseModel.format(self.goal.calculator.amountTitle2, { categoryName: self.categoryName() }));
                    self.transferObject().categoryName(self.categoryName());
                    break;
                }
            }
        };
        self.back = function () {
            history.go(-1);
        };
        self.cancel = function () {
            history.go(-1);
        };
        goalCalculatorSelectModel.getCategoryList("ACT").done(function (data) {
            if (data && data.goalCategories) {
                var firebatch = false;
                for (var i = 0; i < data.goalCategories.length; i++) {
                    if (data.goalCategories[i].contentId && data.goalCategories[i].contentId.value) {
                        firebatch = true;
                        var contentURL = {
                            value: "/contents/{id}",
                            params: { "id": data.goalCategories[i].contentId.value }
                        };
                        var obj = {
                            methodType: "GET",
                            uri: contentURL,
                            headers: {
                                "Content-Id": i + 1,
                                "Content-Type": "application/json"
                            }
                        };
                        payLoad.batchDetailRequestList.push(obj);
                    }
                }
                if (firebatch) {
                    goalCalculatorSelectModel.fireBatch(payLoad).done(function (batchData) {
                        if (batchData && batchData.batchDetailResponseDTOList) {
                            for (var j = 0; j < batchData.batchDetailResponseDTOList.length; j++) {
                                var batchResponse = JSON.parse(batchData.batchDetailResponseDTOList[j].responseText);
                                if (batchResponse.contentDTOList) {
                                    contentMap[batchResponse.contentDTOList[0].contentId.value] = batchResponse.contentDTOList[0].content;
                                }
                            }
                        }
                        for (var i = 0; i < data.goalCategories.length; i++) {
                            if (data.goalCategories[i].contentId && data.goalCategories[i].contentId.value) {
                                data.goalCategories[i].content = contentMap[data.goalCategories[i].contentId.value];
                            }
                            self.categories.push(data.goalCategories[i]);
                        }
                        self.isLoaded(true);
                    });
                } else {
                    for (var j = 0; j < data.goalCategories.length; j++) {
                        self.categories.push(data.goalCategories[j]);
                    }
                    self.isLoaded(true);
                }
            }
        });
    };
});