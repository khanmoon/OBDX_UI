define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/goal-category-select",
    "framework/js/constants/constants",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojinputnumber"
], function (oj, ko, $, BaseLogger, ResourceBundle, constants) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        constants.module = "GOAL";
        self.validationTracker = ko.observable();
        self.transferObject = rootParams.rootModel.params.transferDTO;
        self.isCalculationRequired = rootParams.rootModel.params.isCalculationRequired;
        self.content = rootParams.rootModel.params.transferDTO.content;
        self.goal = ResourceBundle.goal;
        rootParams.dashboard.headerName(self.goal.amount_title);
        rootParams.baseModel.registerElement([
            "page-section",
            "amount-input"
        ]);
        self.back = function () {
            history.go(-1);
        };
        self.proceed = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("goalAmountTracker"))) {
                return;
            }
            if (self.isCalculationRequired) {
                rootParams.dashboard.loadComponent("goal-calculator", JSON.parse(ko.toJSON(self.transferObject)), self);
            } else {
                self.transferObject.dataCalculated = self.isCalculationRequired;
                rootParams.dashboard.loadComponent("create-goal", { transferDTO: self.transferObject }, self);
            }
        };
        self.cancel = function () {
            history.go(-2);
        };
    };
});