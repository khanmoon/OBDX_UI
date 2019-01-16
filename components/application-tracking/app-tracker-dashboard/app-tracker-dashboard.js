define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/application-dashboard",
    "ojs/ojknockout",
    "ojs/ojbutton"
], function (oj, ko, $, ApplicationDashboardModel, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.headingText(self.resource.headingText);
        rootParams.baseModel.registerComponent("modal-window", "base-components");
        rootParams.baseModel.registerComponent("app-tracker-dashboard-view", "application-tracking");
        self.cancelApplication = function () {
            if (self.applicationInfo().currentApplicationId() !== "") {
                ApplicationDashboardModel.withdrawApplication(self.applicationInfo().currentSubmissionId(), self.applicationInfo().currentApplicationId()).done(function () {
                    $("#confirmCancellationModelWindow").trigger("closeModal");
                    $("#successfullyCancelledModalWindow").trigger("openModal");
                }).fail(function () {
                    $("#confirmCancellationModelWindow").trigger("closeModal");
                });
            }
        };
    };
});
