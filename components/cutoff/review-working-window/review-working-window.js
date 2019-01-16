define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",

    "ojL10n!resources/nls/transaction-cutoff"
], function (oj, ko, $, BaseLogger, ReviewWorkingWindow, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.mode = ko.observable("REVIEW");
        self.exception = self.params.data;
        self.approvalFlow = true;
        self.reviewComponentName = null;
        self.displayReviewComponent = ko.observable(false);
        function loadReviewComponent() {
            if (self.exception.workingWindowType() === "STANDARD") {
                self.reviewComponentName = "review-standard-work-window";
            } else {
                self.reviewComponentName = "review-exception-working-window";
            }
            rootParams.baseModel.registerComponent(self.reviewComponentName, "cutoff");
            self.displayReviewComponent(true);
        }
        if (self.exception.workingWindowType) {
            loadReviewComponent();
        } else {
            ReviewWorkingWindow.readWW(self.exception.workingWindowId()).done(function (data) {
                self.exception = ko.mapping.fromJS(data.workingWindowDTO);
                loadReviewComponent();
            });
        }
    };
});