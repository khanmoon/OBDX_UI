define([
    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/forgot-password",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojvalidation",
    "ojs/ojknockout-validation",
    "ojs/ojdatetimepicker"
], function (ko, $, UserInformationModel, Constants, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.userId = ko.observable();
        self.response = ko.observable();
        self.nls = resourceBundle;
        self.verificationResponse = ko.observable();
        self.userIdNullCheck = ko.observable();
        self.forgotPassword = ko.observable(true);
        self.customComponentName = ko.observable();
        self.dobNullCheck = ko.observable();
        self.verification = ko.observable(false);
        self.userInformation = ko.observable(true);
        self.baseURL = ko.observable();
        self.dateOfBirth = ko.observable();
        rootParams.baseModel.registerComponent("otp-verification", "base-components");
        rootParams.baseModel.registerComponent("reset-password", "recovery");
        $(document).on("focusout", function () {
			rootParams.baseModel.showComponentValidationErrors(self.userIdNullCheck());
        });
        self.verify = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.dobNullCheck())) {
                return;
            }
            var payload = ko.toJSON({
                userId: self.userId(),
                dateOfBirth: self.dateOfBirth()
            });
            UserInformationModel.updatePasswordRequest(payload).done(function (data) {
                self.response(data);
                self.verificationResponse(data);
                if (Constants.module === "WALLET") {
                    self.customComponentName("reset-password");
                    self.forgotPassword(false);
                } else {
                    rootParams.dashboard.loadComponent("reset-password", {}, self);
                }
            });
        };
        self.cancelClicked = function () {
            window.location = "/index.html";
        };
    };
});
