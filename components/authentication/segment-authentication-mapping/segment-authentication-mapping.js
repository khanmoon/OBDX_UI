define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/authentication",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation"
], function (oj, ko, $, SegmentAuthenticationMapingModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = ResourceBundle;
        rootParams.dashboard.headerName(self.nls.authentication.headers.authentication);
        self.userSegmentsLoaded = ko.observable(false);
        self.validationTracker = ko.observable();
        rootParams.baseModel.registerComponent("view-authentication-maintenance", "authentication");
        self.back = function () {
            history.back();
        };
        self.userSegmentsList = ko.observableArray();
        self.segmentSelected = self.segmentSelected || ko.observable();
        self.save = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            rootParams.dashboard.loadComponent("view-authentication-maintenance", { selectedSegmentId: self.segmentSelected() }, self);
        };
        SegmentAuthenticationMapingModel.listUserSegments().done(function (data) {
            self.userSegmentsList(data.enterpriseRoleDTOs);
            self.userSegmentsLoaded(true);
        });
    };
});
