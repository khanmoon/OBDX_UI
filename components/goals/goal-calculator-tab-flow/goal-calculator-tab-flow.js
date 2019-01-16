define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "./model"
], function (oj, ko, $, BaseLogger, Model) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(Model.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.stageSelectCategory = ko.observable(true);
        self.stageGoalAmount = ko.observable(false);
        self.stageGoalCalculator = ko.observable(false);
        rootParams.baseModel.registerComponent("goal-category-select", "goals");
        rootParams.baseModel.registerComponent("goal-amount", "goals");
        rootParams.baseModel.registerComponent("goal-calculator", "goals");
        self.transferObject = ko.observable(getNewKoModel.transferObject);
        self.switchToSelectCategoryMode = function () {
            self.stageGoalAmount(false);
            self.stageGoalCalculator(false);
            self.stageSelectCategory(true);
        };
        self.switchToGoalAmountMode = function () {
            self.stageSelectCategory(false);
            self.stageGoalCalculator(false);
            self.stageGoalAmount(true);
        };
        self.switchToGoalCalculatorMode = function () {
            self.stageSelectCategory(false);
            self.stageGoalAmount(false);
            self.stageGoalCalculator(true);
        };
    };
});