define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/dd-action-card"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.cardData = rootParams.data;
        self.image = ko.observable();
        rootParams.baseModel.registerElement("action-card");
        self.cardData.title = self.resource.demandDeposit.calculator.title;
        self.cardData.description = self.resource.demandDeposit.calculator.description;
        rootParams.baseModel.registerComponent("forex-calculator", "calculators");
        self.actionCardClick = function (component, context) {
            if (component === "dashboard.calculator.forex_calculator") {
                self.openComponent = ko.observable("forex-calculator");
                context.loadComponent(self.openComponent(), {}, context);
            }
        };
    };
});
