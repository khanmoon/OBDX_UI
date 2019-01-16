define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/standing-instructions-landing",
    "ojs/ojradioset",
    "ojs/ojknockout"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel.previousState ? Params.rootModel.previousState.retainedData : Params.rootModel);
        self.resource = ResourceBundle;
        Params.baseModel.registerComponent("standing-instructions-list", "payments");
        Params.baseModel.registerComponent("payments-money-transfer", "payments");
        self.SIoptionsArray = [
            {
                id: "standing-instructions-list",
                label: self.resource.labels.silist
            },
            {
                id: "payments-money-transfer",
                label: self.resource.labels.sicreate
            }
        ];
        self.selectedOption = ko.observable(self.params.component || "standing-instructions-list");
    };
});