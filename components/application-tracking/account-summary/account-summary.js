define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/loan-account-summary",
    "ojs/ojinputtext",
    "ojs/ojbutton",
    "ojs/ojinputnumber"
], function (oj, ko, $, AccountSummaryModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.accountSummaryInfoLoaded = ko.observable(false);
        self.stageDetails = [];
        AccountSummaryModel.fetchAccountSummary(self.applicationInfo().currentSubmissionId(), self.appDetails().applicationId.value).done(function (data) {
            self.stageDetails = data.loanAccountConfigurationDTO.accountSummary;
            self.accountSummaryInfoLoaded(true);
        });
        self.getIndex = function (obj, key) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].stageName === key) {
                    return i;
                }
            }
        };
    };
});
