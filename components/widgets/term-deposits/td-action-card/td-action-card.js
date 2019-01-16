define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/td-action-card"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.cardData = rootParams.data;
        self.image = ko.observable();
        rootParams.baseModel.registerComponent("td-open", "term-deposits");
        rootParams.baseModel.registerElement("action-card");
        self.actionCardClick = function (id, context) {
            if (id === "dashboard.newDeposit.newDeposit") {
                self.openComponent = ko.observable("td-open");
                context.loadComponent(self.openComponent(), {}, context);
            } else if (id === "dashboard.calculator.savings_calculator") {
                rootParams.baseModel.registerComponent("savings-calculator", "calculators");
                self.openComponent = ko.observable("savings-calculator");
                context.loadComponent(self.openComponent(), {}, context);
            }
        };
        if (self.cardData.type === "new_term_deposit") {
            self.cardData.title = self.resource.termDeposit.newDeposit.title;
            self.cardData.description = self.resource.termDeposit.newDeposit.description;
        } else if (self.cardData.type === "td_calc") {
            self.cardData.title = self.resource.termDeposit.calculator.title;
            self.cardData.description = self.resource.termDeposit.calculator.description;
        }
    };
});
