define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/dashboard-admin-action-card"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.resource = resourceBundle;
        self.cardData = rootParams.data.data;
        self.onCardClick = function (id, module) {
            rootParams.baseModel.registerComponent(id, module);
            rootParams.dashboard.loadComponent(id);
        };
    };
});