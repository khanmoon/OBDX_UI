define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "paperAccordion"
], function (oj, ko, $) {
    "use strict";
    return function (rootParams) {
        var self = this, i = 0;
        ko.utils.extend(self, rootParams.rootModel);
        self.productHeadingName(self.productDetails().currentStage.name);
        self.showComponents = ko.observable(false);
        self.productDetails().currentStage.applicantAccordion = ko.observable({});
        self.indexCollateralInfo = 1;
        self.indexOffers = 2;
        self.indexCCI = 3;
        self.offersLoaded = ko.observable(true);
        self.disableReviewButton = ko.observable(true);
        self.accountSummaryData = ko.observable();
        self.components = ko.observableArray([{
                name: self.accordionNames.accordionNames.deliveryPreferences,
                component: "card-account"
            }]);
        for (i = 0; i < self.productDetails().currentStage.stages.length; i++) {
            rootParams.baseModel.registerComponent(self.productDetails().currentStage.stages[i].id, "origination");
            self.components.push({
                name: self.productDetails().currentStage.stages[i].name,
                component: self.productDetails().currentStage.stages[i].id
            });
            self.productDetails().currentStage.stages[i].isComplete = ko.observable(false);
        }
        self.initializeAccordion = function () {
            self.productDetails().currentStage.applicantAccordion($("#offersInsuranceAccordion").paperAccordion({
                disableOthers: true,
                zoom: false
            }));
            for (i = 0; i < self.productDetails().currentStage.stages.length; i++) {
                if (self.productDetails().currentStage.stages[i].isComplete()) {
                    self.productDetails().currentStage.applicantAccordion().enable(i + 2);
                }
            }
        };
        self.showNextComponent = function (ind) {
            self.productDetails().currentStage.applicantAccordion().close(ind);
            if (ind < self.components().length) {
                self.productDetails().currentStage.applicantAccordion().open(ind + 1);
                self.productDetails().currentStage.applicantAccordion().enable(ind + 1);
            }
        };
        self.showComponents(true);
    };
});
