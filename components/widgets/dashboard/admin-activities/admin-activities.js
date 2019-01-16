define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/admin-activity",
    "ojs/ojinputtext",
    "ojs/ojpopup"
], function (oj, ko, $, AdminActivitiesModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.flag = ko.observable(false);
        rootParams.baseModel.registerElement("action-widget");
        self.details = ko.observableArray();
        self.imgPath = ko.observable();
        self.showPopup = ko.observable(false);
        AdminActivitiesModel.fetchLines().done(function (data) {
            self.details(data.module);
            self.flag(true);
        });
        self.loadPage = function (data) {
            if (data.component) {
                rootParams.baseModel.registerComponent(data.component, data.module);
                rootParams.dashboard.loadComponent(data.component, { type: data.type });
            } else {
                if (data.targetComponent) {
                    rootParams.baseModel.registerComponent(data.targetComponent, data.module);
                }
                rootParams.dashboard.switchModule(data.module);
            }
        };
    };
});