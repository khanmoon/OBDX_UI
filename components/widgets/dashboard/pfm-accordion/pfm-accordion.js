define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/pfm-accordion",
    "ojs/ojaccordion"
], function (oj, ko, $, ListingModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.resource = ResourceBundle;
        self.dataLoaded = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel);
        self.items = ko.observableArray();
        rootParams.baseModel.registerComponent("goals-dashboard-card", "goals");
        rootParams.baseModel.registerComponent("budgets-dashboard-card", "personal-finance-management");
        rootParams.baseModel.registerComponent("spend-summary", "personal-finance-management");
        self.refreshWidget = function () {
            $(".dashboard-accordian-container").ojAccordion("refresh");
        };
        $.when(ListingModel.getBudgetDetails(), ListingModel.getSpendAnalysis(), ListingModel.getGoalDetails()).then(function (budgetData, spendData, goalData) {
            self.items.removeAll();
            if (!spendData.spendAnalysis) {
                self.items.push({
                    type: "SPN",
                    value: self.resource.noSpends,
                    css: ""
                });
            } else {
                var totalSpend = 0;
                for (var i = 0; i < spendData.spendAnalysis.length; i++) {
                    totalSpend += spendData.spendAnalysis[i].totalSpent;
                }
                self.items.push({
                    type: "SPN",
                    value: rootParams.baseModel.formatCurrency(totalSpend, spendData.spendAnalysis[0].currency),
                    css: ""
                });
            }
            if (budgetData.budgetDTOs) {
                self.items.push({
                    type: "BDG",
                    value: rootParams.baseModel.format(self.resource.activeBudgets, { count: budgetData.budgetDTOs.length }),
                    css: ""
                });
            } else {
                self.items.push({
                    type: "BDG",
                    value: self.resource.noBudgets,
                    css: ""
                });
            }
            if (goalData.goalDTO.length !== 0) {
                self.items.push({
                    type: "GOL",
                    value: rootParams.baseModel.format(self.resource.activeGoals, { count: goalData.goalDTO.length }),
                    css: ""
                });
            } else {
                self.items.push({
                    type: "GOL",
                    value: self.resource.noGoals,
                    css: ""
                });
            }
            self.dataLoaded(true);
        });
    };
});
