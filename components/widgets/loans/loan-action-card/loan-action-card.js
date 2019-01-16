define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/loan-action-card"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.cardData = rootParams.data;
        self.image = ko.observable();
        rootParams.baseModel.registerComponent("loan-eligibility-calculator", "loans");
        rootParams.baseModel.registerComponent("loan-calculator", "loans");
        rootParams.baseModel.registerComponent("loan-calculations", "loans");
        rootParams.baseModel.registerElement("action-card");
        if (self.cardData.type === "new_loan") {
            self.cardData.title = self.resource.cardData.newLoan.title;
            self.cardData.description = self.resource.cardData.newLoan.description;
        } else if (self.cardData.type === "loan_calc") {
            self.cardData.title = self.resource.cardData.loanCalculator.title;
            self.cardData.description = self.resource.cardData.loanCalculator.description;
        }
        self.actionCardClick = function (actionType, context) {
            if (actionType === "dashboard.calculator.calculator") {
                context.loadComponent("loan-calculations", {}, context);
            }
        };
    };
});
