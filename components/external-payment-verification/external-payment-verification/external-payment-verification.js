define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/external-payment",
    "ojs/ojinputnumber",
    "ojs/ojinputtext"
], function (oj, ko, $, ExternalPaymentVerificationModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(ExternalPaymentVerificationModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.baseModel.registerComponent("otp-verification", "base-components");
        rootParams.baseModel.registerElement("confirm-screen");
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.epiVerificationModel = getNewKoModel().epiVerificationModel;
        self.verificationId = ko.observable();
        self.validationTracker = ko.observable();
        self.isSuccess = ko.observable(false);
        ExternalPaymentVerificationModel.init();
        self.initiatePayment = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            var payload = ko.toJSON(self.epiVerificationModel);
            ExternalPaymentVerificationModel.initiatePayment(payload).done(function (data) {
                self.verificationId(data.verifyReqId);
                ExternalPaymentVerificationModel.readPayment(data.verifyReqId).done(function (data) {
                    self.stageTwo(true);
                    self.stageOne(false);
                    if (data.status) {
                        self.isSuccess(true);
                    } else {
                        self.isSuccess(false);
                    }
                });
            });
        };
    };
});