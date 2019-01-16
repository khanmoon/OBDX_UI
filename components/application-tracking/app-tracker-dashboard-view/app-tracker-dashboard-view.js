define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "ojL10n!resources/nls/application-dashboard-view",
    "ojs/ojaccordion",
    "ojs/ojcollapsible",
    "ojs/ojradioset"
], function (oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        rootParams.baseModel.registerComponent("app-tracker-documents", "application-tracking");
        rootParams.baseModel.registerComponent("account-summary", "application-tracking");
    };
});
