define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/alpha/resources/nls/application-summary",
    "ojs/ojprogressbar"
], function (oj, ko, $, ApplicationSummaryModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, index = 0;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.dataLoaded = ko.observable(false);
        self.screensToContainThis = ko.observable(["application-dashboard"]);
        self.shouldSummaryBeShown = function () {
            for (index = 0; index < self.screensToContainThis().length; index++) {
                if (self.productTrackingComponentName() === self.screensToContainThis()[index]) {
                    return true;
                }
            }
            return false;
        };
        ApplicationSummaryModel.fetchApplicationSummary(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
            self.appDetails(data);
            self.isSummaryLoaded(true);
            self.isSummaryResponse(true);
        });
        ApplicationSummaryModel.fetchApplicationDetails(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
            data.applicationDetails.applicationStatus = self.findApplicationValue(data.applicationDetails.applicationStatus);
            data.applicationDetails.submissionDate = new Date(data.applicationDetails.submissionDate).toDateString();
            data.applicationDetails.lastUpdatedDate = new Date(data.applicationDetails.lastUpdatedDate).toDateString();
            self.applicationSummary(data.applicationDetails);
            ApplicationSummaryModel.fetchApplicationStages(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
                self.applicationSummary().progress = data.overAllProgress;
                if (!self.applicationSummary().progress) {
                    self.showCancelApplication(false);
                }
                if (self.applicationSummary().progress === 100) {
                    self.showCancelApplication(false);
                }
                self.dataLoaded(true);
            });
        });
    };
});