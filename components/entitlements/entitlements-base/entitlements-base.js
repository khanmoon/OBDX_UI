define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/authorization",
    "ojs/ojinputtext",
    "ojs/ojradioset",

    "promise"
], function(oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.isLoading = ko.observable(false);
        rootParams.dashboard.headerName(self.nls.headings.entitlement);
        rootParams.baseModel.registerComponent("entitlements-search", "entitlements");
        rootParams.baseModel.registerComponent("entitlements-search-results", "entitlements");
        rootParams.baseModel.registerComponent("entitlements-details", "entitlements");

    };
});
