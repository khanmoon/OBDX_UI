define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/rules",
    "ojs/ojinputtext",
    "ojs/ojradioset"
], function (oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerComponent("rules-create", "approvals");
        rootParams.baseModel.registerComponent("rules-search", "approvals");
        self.actionHeaderheading = ko.observable(self.nls.rules.ruleMaintainance);
        self.initiatorType = ko.observable();
        self.createWorkflow = ko.observable();
        self.searchWorkflow = ko.observable();
    };
});