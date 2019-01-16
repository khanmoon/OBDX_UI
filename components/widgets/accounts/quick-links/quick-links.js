define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/quick-links"
], function (oj, ko, $, QuickLinksModel, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        var i, l;
        var quickLinksType = rootParams.type || rootParams.dashboard.application();
        rootParams.baseModel.registerElement([
            "account-input",
            "action-widget"
        ]);
        self.modulesLoaded = ko.observable(false);
        self.accountNumber = ko.observable("");
        self.quickLinks = ko.observableArray();
        self.valueAssigner = function (data) {
            for (var l = data.length, i = l; i--;) {
                data[i].name = self.locale.quickLinks[data[i].name.split(".")[0]][data[i].name.split(".")[1]];
                data[i].title = self.locale.quickLinks[data[i].title.split(".")[0]][data[i].title.split(".")[1]];
                data[i].action = { "action": data[i].action };
            }
            return data;
        };
        QuickLinksModel.getJSONData().done(function (data) {
            var components = data[quickLinksType] || data.default;
            for (l = components.length, i = l; i--;) {
                rootParams.baseModel.registerComponent(components[i].id, components[i].module);
            }
            var localArray = self.valueAssigner(components);
            self.quickLinks.removeAll();
            ko.utils.arrayPushAll(self.quickLinks, localArray);
            self.modulesLoaded(true);
        });
        self.callShowDetails = function (component, data, action) {
            if (self.accountNumber() && data.taskCode) {
                QuickLinksModel.validateAccess(self.accountNumber(), data.taskCode).done(function () {
                    rootParams.dashboard.loadComponent(data.id, action);
                });
            } else {
                rootParams.dashboard.loadComponent(data.id, action);
            }
        };
    };
});