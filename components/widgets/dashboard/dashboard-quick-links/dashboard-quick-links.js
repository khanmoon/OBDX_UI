define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/dashboard-quick-links",
    "json!local!./quick-access",
    "json!local!./payments-quick-links"
], function (oj, ko, $, ResourceBundle, quickLinks, paymentsQuickLinks) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.resource = ResourceBundle;
        var linksJSONS = {
            "quick-access": quickLinks,
            "payments-quick-links": paymentsQuickLinks
        };
        self.type = rootParams.data ? rootParams.data.data.type : rootParams.rootModel.params.type;
        self.dataLoaded = ko.observable(false);
        self.subheading = self.resource[self.type];
        self.quicklinksArray = ko.observableArray();
        if (self.params && self.params.isHeader) {
            self.subheading = null;
            rootParams.dashboard.headerName(self.resource[self.type]);
        }

        self.iconClick = function (context) {
            rootParams.baseModel.registerComponent(context.module, context.parentModule);
            if (context.applicationType) {
                rootParams.dashboard.loadComponent("manage-accounts", {
                    applicationType: context.applicationType,
                    defaultTab: context.module,
                    moduleURL: context.moduleURL,
                    data: context.data
                });
            } else {
                rootParams.dashboard.loadComponent(context.module);
            }
        };

        self.quicklinksArray(linksJSONS[self.type]);
        self.dataLoaded(true);

    };
});