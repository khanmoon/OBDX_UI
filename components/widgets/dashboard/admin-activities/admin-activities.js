define([
    "knockout",
    "ojL10n!resources/nls/admin-activity",
    "json!local!./links",
    "ojs/ojinputtext",
    "ojs/ojpopup"
], function (ko, resourceBundle,links) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.nls = resourceBundle;
        self.links=links;
        self.type=rootParams.data ? rootParams.data.data.type :rootParams.rootModel.params.type;
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