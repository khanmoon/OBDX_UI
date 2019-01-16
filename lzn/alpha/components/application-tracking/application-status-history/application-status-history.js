define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "baseLogger",
    "ojL10n!lzn/alpha/resources/nls/application-status-history"
], function (oj, ko, $, ApplicationStatusHistoryModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, i;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.headingText(self.resource.statusHistory);
        self.statusHistory = ko.observableArray([]);
        self.applicationStateStringMap = ko.observable("");
        self.findApplicationStateValue = function (code) {
            var index;
            for (index = 0; index < self.applicationStateStringMap().length; index++) {
                if (self.applicationStateStringMap()[index].code === code) {
                    return self.applicationStateStringMap()[index].description;
                }
            }
            return self.resource.processing;
        };
        ApplicationStatusHistoryModel.fetchApplicationHistory(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function (data) {
            var hrs, date, min;
            if (data.statusUpdateDetails) {
                ApplicationStatusHistoryModel.fetchApplicationStateStringMap(data.statusUpdateDetails).done(function (data, statusHistory) {
                    self.applicationStateStringMap(data.enumRepresentations[0].data, statusHistory);
                    for (i = 0; i < statusHistory.length; i++) {
                        statusHistory[i].currentStatus = self.findApplicationStateValue(statusHistory[i].currentStatus);
                        if (statusHistory[i].statusUpdatedOn) {
                            statusHistory[i].statusUpdatedOn = new Date(statusHistory[i].statusUpdatedOn);
                            hrs = statusHistory[i].statusUpdatedOn.getHours();
                            date = statusHistory[i].statusUpdatedOn.toDateString();
                            min = statusHistory[i].statusUpdatedOn.getMinutes();
                            statusHistory[i].statusUpdatedOn = date + ", " + hrs + " : " + min + " hrs";
                        }
                    }
                    self.statusHistory(statusHistory);
                });
            }
        });
    };
});