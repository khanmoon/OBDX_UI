define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/alert-action-card"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        rootParams.dashboard.headerName(self.resource.manageAlerts);
        self.typeAlerts = [
            "PI",
            "CH",
            "TD",
            "LN",
            "PC"
        ];
        rootParams.baseModel.registerComponent("alerts-subscription", "alerts");
        self.actionCardClick = function (alertType) {
            rootParams.dashboard.loadComponent("alerts-subscription", { moduleId: alertType }, self);
        };
    };
});