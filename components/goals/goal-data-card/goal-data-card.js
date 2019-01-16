define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/list-goal"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.cardData = ko.observable(Params.data);
        Params.baseModel.registerComponent("percentage-graph", "personal-finance-management");
        var barTooltip = document.createElement("div");
        self.goalTooltipCallback = function (dataContext) {
            var achieved = Params.baseModel.formatCurrency(Number(dataContext.label.replace(/[,]/g, "")), self.baseCurrency());
            if (achieved && achieved !== "") {
                require(["text!../partials/pfm/goals/goal-progress-tool-tip.html"], function (barTooltipLocal) {
                    var tooltip = {
                        title: self.resource.goals.achievedTitle,
                        achievedTitle: self.resource.goals.achievedTitle,
                        achievedAmount: achieved
                    };
                    $(barTooltip).html(barTooltipLocal);
                    ko.cleanNode(barTooltip);
                    ko.applyBindings(tooltip, barTooltip);
                });
                return barTooltip;
            }
        };
        self.openMenu = function (model, event) {
            var launcherId = event.currentTarget.attributes.id.nodeValue;
            self.launcherId = launcherId;
            setTimeout(function () {
                $("#" + launcherId + "-container").ojMenu("open", event);
            }, 1);
        };
    };
});