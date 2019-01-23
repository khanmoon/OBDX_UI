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
        self.quickLinkResourceBundle = locale;
        var i, l;
        var quickLinksType = rootParams.type || rootParams.dashboard.application();
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("action-widget");
        self.modulesLoaded = ko.observable(false);
        self.quickLinks = ko.observableArray();
        self.valueAssigner = function (data) {
            for (var l = data.length, i = l; i--;) {
                data[i].description = self.quickLinkResourceBundle.quickLinks[data[i].name.split(".")[0]][data[i].name.split(".")[1]];
            }
            return data;
        };
        require.undef("json!quickLinks");
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
            if (self.additionalDetails && self.additionalDetails() && data.taskCode) {
                     rootParams.dashboard.loadComponent(data.id, self.additionalDetails() ? self.additionalDetails().account : action);
            } else {
                var parameters;
                if (self.additionalDetails && self.additionalDetails()) {
                    parameters = self.additionalDetails().account;
                } else if (action) {
                    parameters = action;
                } else {
                    parameters = { type: data.type };
                }
                rootParams.dashboard.loadComponent(data.id, parameters);
            }
        };
    };
});