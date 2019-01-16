define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/alerts-list"
], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = resourceBundle;
        Params.dashboard.headerName(self.resource.header);
        self.refreshModuleID = ko.observable();
        self.moduleId = "PI";
        Params.baseModel.registerComponent("alerts-subscription", "alerts");
        Params.baseModel.registerElement("nav-bar");
        self.selectedItem = ko.observable();
        self.uiOptions = {
          "menuFloat": "left",
          "fullWidth": false,
          "defaultOption": self.selectedItem
        };
        self.listItem = [
            {
                id: "PI",
                moduleId: "alerts-profile",
                label: self.resource.labels["alerts-profile"],
                imageUrl: "dashboard/quick-access/manage-recipients.svg"
            },
            {
                id: "CH",
                moduleId: "alerts-casa",
                label: self.resource.labels["alerts-casa"],
                imageUrl: "index/icons/savings.svg"
            },
            {
                id: "TD",
                moduleId: "alerts-td",
                label: self.resource.labels["alerts-td"],
                imageUrl: "index/icons/td.svg"
            },
            {
                id: "LN",
                moduleId: "alerts-loans",
                label: self.resource.labels["alerts-loans"],
                imageUrl: "index/icons/personal-loan.svg"
            },
            {
                id: "PC",
                moduleId: "alerts-payments",
                label: self.resource.labels["alerts-payments"],
                imageUrl: "dashboard/quick-access/request-money.svg"
            }
        ];
        self.selectedItem.subscribe(function (menuOption) {
            Params.baseModel.registerComponent(menuOption, "alerts");
            if (!Params.baseModel.small()) {
                self.refreshModuleID(false);
                ko.tasks.runEarly();
                self.alertModuleId = menuOption;
                self.refreshModuleID(true);
            } else {
                Params.dashboard.loadComponent("alerts-subscription", { moduleId: menuOption }, self);
            }
        });
        if (!Params.baseModel.small()) {
            self.selectedItem("PI");
        }
    };
});
