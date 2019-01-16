define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/budgets-dashboard-card",
    "ojs/ojmenu"
], function (oj, ko, $, Model, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.resource = ResourceBundle;
        self.countOfBudget = ko.observable();
        self.totalSpend = ko.observable(0);
        self.totalBudget = ko.observable(0);
        self.currency = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.subheader = "";

        Model.getBudgetDetails().done(function (budgetData) {
            self.countOfBudget(0);
            if (budgetData.budgetDTOs) {
                self.countOfBudget(budgetData.budgetDTOs.length);
            }
            self.dataLoaded(true);
        });

        self.menuItems = [{
                id: "createBudget",
                label: self.resource.createBudget
            },
            {
                id: "manageBudgets",
                label: self.resource.manageBudgets
            }
        ];
        self.map = {
            createBudget: {
                id: "createBudget",
                module: "list-budget",
                parentModule: "personal-finance-management"
            },
            manageBudgets: {
                id: "manageBudgets",
                module: "list-budget",
                parentModule: "personal-finance-management"
            }
        };
        self.openMenu = function (model, event) {
            $("#menuLauncher-budget-container").ojMenu("open", event);
        };
        self.menuItemSelect = function (data, event) {
            rootParams.baseModel.registerComponent(self.map[event.target.value].module, self.map[event.target.value].parentModule);
            rootParams.dashboard.loadComponent(self.map[event.target.value].module);
        };
    };
});