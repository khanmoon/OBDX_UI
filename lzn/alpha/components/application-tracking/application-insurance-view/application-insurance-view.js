define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/alpha/resources/nls/application-insurance-view"
], function (oj, ko, $, ApplicationInsuranceViewService, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.insuranceSummary = ko.observable({});
        self.dataLoaded = ko.observable(false);
        ApplicationInsuranceViewService.fetchAppInsurance(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
            self.insuranceSummary(data);
            self.dataLoaded(true);
        });
    };
});