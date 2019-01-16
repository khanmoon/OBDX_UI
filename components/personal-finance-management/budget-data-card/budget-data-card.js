define([
    "ojs/ojcore",
    "knockout",
    "jquery"

], function (oj, ko, $) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.cardData = ko.observable(Params.data);
        Params.baseModel.registerComponent("percentage-graph", "personal-finance-management");
        var barTooltip = document.createElement("div");
        self.budgetTooltipCallback = function (dataContext) {
            var consumed = Params.baseModel.formatCurrency(Number(dataContext.label.replace(/[,]/g, "")), self.baseCurrency);
            if (consumed && consumed !== "") {
                require(["text!../partials/pfm/budget/budget-progress-tool-tip.html"], function (barTooltipLocal) {
                    var tooltip = {
                        title: self.resource.budget.consumedtitletooltip,
                        consumedTitle: self.resource.budget.consumedtitletooltip,
                        consumedAmount: consumed
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
            var menuVisible = $("#" + launcherId + "-container")[0].style.display === "block";
            if (!menuVisible) {
                try {
                    setTimeout(self.open, 0.1);
                } catch (e) {
                    $("#" + launcherId + "-container")[0].style.display = "block";
                }
            } else {
                $("#" + launcherId + "-container")[0].style.display = "none";
            }
        };
        self.open = function () {
            $("#" + self.launcherId + "-container").ojMenu("open", event);
        };
    };
});