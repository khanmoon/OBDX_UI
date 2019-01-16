define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",

    "ojL10n!resources/nls/alerts",
    "ojs/ojinputtext",
    "ojs/ojnavigationlist"
], function (oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.moduleSelected = ko.observable(false);
        self.uiOptions = {
            "menuFloat": "right",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        var menuselectionSubscription = self.menuSelection.subscribe(function (newValue) {
            if (newValue === "CASA") {
                self.moduleSelected(true);
                self.componentId("alerts-subscription-casa");
            } else if (newValue === "TD") {
                self.moduleSelected(true);
                self.componentId("alerts-subscription-td");
            } else if (newValue === "LOANS") {
                self.moduleSelected(true);
                self.componentId("alerts-subscription-loans");
            } else if (newValue === "PROFILE") {
                self.moduleSelected(true);
                self.componentId("alerts-subscription-profile");
            } else if (newValue === "PAYMENTS") {
                self.moduleSelected(true);
                self.componentId("alerts-subscription-payments");
            }
        });
        self.dispose = function () {
            menuselectionSubscription.dispose();
        };
        rootParams.baseModel.registerElement("nav-bar");
    };
});