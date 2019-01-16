define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/pfm-dashboard"
], function (oj, ko, $, PFMdashboard, ResourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        params.baseModel.registerComponent("spend-summary", "widgets/personal-finance-management");
        params.baseModel.registerComponent("budgets-dashboard-card", "widgets/personal-finance-management");
        params.baseModel.registerComponent("goals-dashboard-card", "widgets/personal-finance-management");
        self.resource = ResourceBundle;
        if (!params.dashboard.isDashboard()) {
            params.dashboard.headerName(self.resource.title);
        }
    };
});