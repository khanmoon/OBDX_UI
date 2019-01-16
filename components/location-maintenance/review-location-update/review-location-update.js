define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/review-location-update"
], function (ko, $, model, locale) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        self.back = ko.observable(false);
        params.dashboard.headerName(self.nls.headings.transactionName);
        self.reviewData = ko.toJS(params.rootModel.params.updateData);
        params.baseModel.registerComponent("location-update", "location-maintenance");
        self.workTimings = function () {
            var timings = "";
            timings = self.reviewData.workDays[0] + ": " + self.reviewData.workTimings[0];
            return timings;
        };
        self.workTimings1 = function () {
            if (self.reviewData.workDays[1] !== null) {
                var timings = "";
                timings = self.reviewData.workDays[1] + ": " + self.reviewData.workTimings[1];
                return timings;
            }
        };
        self.edit = function () {
            self.back(true);
            params.dashboard.loadComponent("location-update", {}, self);
        };
    };
});
