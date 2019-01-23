define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/dashboard-admin-action-card",
    "json!local!./dashboard-admin-action-card"
], function (ko, $, resourceBundle,AdminActionCardJSON) {
    "use strict";

    return function (rootParams) {
        var self = this;
        self.resource = resourceBundle;

        self.cardData = {
            type: rootParams.data.data.type,
            submenus: AdminActionCardJSON[rootParams.data.data.type]
        };

        self.onCardClick = function (id, module) {
            rootParams.baseModel.registerComponent(id, module);
            rootParams.dashboard.loadComponent(id);
        };
    };
});