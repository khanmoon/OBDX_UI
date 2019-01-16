define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/goals-dashboard-card",
    "ojs/ojmenu"
], function (oj, ko, $, Model, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.resource = ResourceBundle;
        self.countOfGoals = ko.observable(0);

        self.dataLoaded = ko.observable(false);
        self.menuItems = [{
                id: "creategoal",
                label: self.resource.creategoal
            },
            {
                id: "managegoals",
                label: self.resource.managegoals
            }
        ];
        self.map = {
            creategoal: {
                module: "goal-category-select",
                parentModule: "goals"
            },
            managegoals: {
                module: "list-goal",
                parentModule: "goals"
            }
        };

        function setGoalDetails(data) {
            if (data.goalDTO && data.goalDTO.length > 0) {
                self.countOfGoals(data.goalDTO.length);
                var indexOfClosestTenure = 0;
                for (var i = 0; i < data.goalDTO.length; i++) {
                    if (Date.parse(data.goalDTO[i].tenure.date) < Date.parse(data.goalDTO[indexOfClosestTenure].tenure.date)) {
                        indexOfClosestTenure = i;
                    }
                }
                self.goalDTOs = data.goalDTO;
                self.goal = data.goalDTO[indexOfClosestTenure];
            }
        }

        Model.getGoalDetails().done(function (data) {
            self.countOfGoals(0);
            setGoalDetails(data);
            self.dataLoaded(true);
        });

        self.openMenu = function (model, event) {
            $("#menuLauncher-goals-container").ojMenu("open", event);
        };
        self.menuItemSelect = function (data, event) {
            rootParams.baseModel.registerComponent(self.map[event.target.value].module, self.map[event.target.value].parentModule);
            rootParams.dashboard.loadComponent(self.map[event.target.value].module);
        };
    };
});