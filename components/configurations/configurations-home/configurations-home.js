define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/configurations",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojlistview",
    "ojs/ojpagingcontrol"

], function (oj, ko, $, ConfigurationsModel, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.resource = resourceBundle;
        self.menuList = ko.observableArray();
        self.componentHeader = ko.observable(self.resource.configuration.categories.header);
        params.baseModel.registerElement("action-card");
        ConfigurationsModel.getMenuList().done(function (data) {
            self.menuList(data.menus);
        });
        self.actionCardClick = function (id) {
            if (id === "AllConfigurations") {
                params.baseModel.registerComponent("categories-home", "configurations");
                params.dashboard.loadComponent("categories-home", {}, self);
            }
            if (id === "AdvancedConfigurations") {
                params.baseModel.registerComponent("description-search", "configurations");
                params.dashboard.loadComponent("description-search", {}, self);
            }
            if (id === "MandatoryConfigurations") {
                params.baseModel.registerComponent("system-configuration-home", "system-configuration");
                params.dashboard.loadComponent("system-configuration-home", {}, self);
            }
        };
    };
});
