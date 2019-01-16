define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "paperAccordion",
    "ojs/ojbutton"
], function (oj, ko, $) {
    "use strict";
    return function (rootParams) {
        var self = this, i = 0;
        ko.utils.extend(self, rootParams.rootModel);
        self.productHeadingName(self.productDetails().currentStage.name);
        self.showComponents = ko.observable(false);
        self.disableSubmit = ko.observable(true);
        if (self.productDetails().sectionBeingEdited()) {
            self.disableSubmit(false);
        }
        self.productDetails().currentStage.applicantAccordion = ko.observable({});
        if (self.productDetails().sectionBeingEdited() === "card-additional-details") {
            for (i = 0; i < self.productDetails().productStages.length; i++) {
                if (self.productDetails().productStages[i].id === self.productDetails().sectionBeingEdited()) {
                    self.productDetails().currentStage = self.productDetails().productStages[i];
                }
            }
        }
        for (i = 0; i < self.productDetails().currentStage.stages.length; i++) {
            rootParams.baseModel.registerComponent(self.productDetails().currentStage.stages[i].id, "origination");
            self.productDetails().currentStage.stages[i].isComplete = ko.observable(false);
        }
        self.displaySubmitButton = function () {
            return true;
        };
        self.initializeAccordion = function () {
            self.productDetails().currentStage.applicantAccordion($("#cardDetailsAccordion").paperAccordion({
                disableOthers: true,
                zoom: false
            }));
        };
        self.showComponents(true);
    };
});