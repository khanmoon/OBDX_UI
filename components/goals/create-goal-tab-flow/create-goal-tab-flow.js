define([
    "ojs/ojcore",
    "knockout"
], function (oj, ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.defaultData = rootParams.options.data();
        self.stageSelectCategory = ko.observable(true);
        self.stageGoalAmount = ko.observable(false);
        self.stageGoalCreate = ko.observable(false);
        rootParams.baseModel.registerComponent("goal-category-select", "goals");
        rootParams.baseModel.registerComponent("goal-amount", "goals");
        rootParams.baseModel.registerComponent("goal-create", "goals");
        self.transferObject = ko.observable({
            categoryId: null,
            subCategoryId: null,
            categoryName: null,
            productDetails: null,
            goalAmount: null,
            initialAmount: null,
            content: null
        });
        self.switchToSelectCategoryMode = function () {
            self.stageGoalAmount(false);
            self.stageGoalCreate(false);
            self.stageSelectCategory(true);
        };
        self.switchToGoalAmountMode = function () {
            self.stageSelectCategory(false);
            self.stageGoalCreate(false);
            self.stageGoalAmount(true);
        };
        self.switchToGoalCreateMode = function () {
            self.stageSelectCategory(false);
            self.stageGoalAmount(false);
            self.stageGoalCreate(true);
        };
        if (self.defaultData) {
            self.transferObject(self.defaultData.transferObject);
            self.switchToGoalCreateMode();
        }
    };
});