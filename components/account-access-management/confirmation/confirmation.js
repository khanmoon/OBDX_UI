define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojs/ojinputtext",
    "ojs/ojradioset",

    "promise"
], function (oj, ko, $) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.isHideDetailsTrue = ko.observable(rootParams.hideDetails);
        self.showConfirmationDialog = ko.observable(true);
        self.hideConfirmationPanel = function () {
            $("#confirmCancellationScreen").hide();
        };
        self.confirmCancellation = function () {
            if (self.isHideDetailsTrue()) {
                rootParams.dashboard.hideDetails();
            } else {
                rootParams.dashboard.openDashBoard();
            }
            self.editButtonPressed(false);
        };
    };
});