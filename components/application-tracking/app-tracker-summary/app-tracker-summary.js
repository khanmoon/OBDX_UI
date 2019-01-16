define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!resources/nls/application-summary",
    "ojs/ojprogressbar"
], function (oj, ko, $, ApplicationSummaryModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        ApplicationSummaryModel.fetchApplicationSummary(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
            self.appDetails(data);
            self.isSummaryLoaded(true);
        });
    };
});