define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/transaction-cutoff",
    "ojs/ojinputtext",
    "ojs/ojradioset"
], function (oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.nls = resourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        self.actionHeaderheading = self.nls.labels.testPartyHeading;
        rootParams.baseModel.registerComponent("standard-work-window", "cutoff");
        rootParams.baseModel.registerComponent("cutoff-exceptions", "cutoff");
        rootParams.baseModel.registerComponent("cutoff-nav-bar", "cutoff");
        self.menuOptions = ko.observable([
            {
                id: "STANDARD",
                data: self.nls.labels.standardWorkingWindow
            },
            {
                id: "EXCEPTION",
                data: self.nls.labels.exceptions
            }
        ]);
        self.menuSelection = ko.observable("STANDARD");
    };
});
