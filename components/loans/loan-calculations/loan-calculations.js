define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/loan-calculations",
    "ojs/ojknockout-validation"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.showLoanEligibility = ko.observable(true);
        self.showLoanCalculator = ko.observable(false);
        self.menuSelection = ko.observable();
        rootParams.baseModel.setwebhelpID("loans-calculator");
        self.menuOptions = ko.observableArray([
            {
                id: "eligibility",
                label: self.nls.loanEligibility
            },
            {
                id: "calculate",
                label: self.nls.loanCalculator
            }
        ]);
        self.uiOptions = {
            "menuFloat": "left",
            "fullWidth": false,
            "defaultOption": self.menuSelection
        };
        self.action = ko.observable("eligibility");
        rootParams.baseModel.registerComponent("loan-eligibility-calculator", "loans");
        rootParams.baseModel.registerComponent("loan-calculator", "loans");
        rootParams.baseModel.registerElement("nav-bar");
        self.menuSelection(self.params.defaultTab || self.menuOptions()[0].id);
        self.menuSelection.subscribe(function (newvalue) {
            if (newvalue === "calculate") {
                self.showLoanEligibility(false);
                self.showLoanCalculator(true);
            } else {
                self.showLoanEligibility(true);
                self.showLoanCalculator(false);
            }
        });
    };
});