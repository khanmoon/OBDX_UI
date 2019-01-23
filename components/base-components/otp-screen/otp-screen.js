define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/otp-screen",
    "./model",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function(ko, $, locale, OTPModel) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.referenceNumber = ko.observable(JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).referenceNo);
        self.scopeType = ko.observable(JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).scope);
        self.isNonce = !!self.currentContext.url.match("session/nonce");
        self.otpSent = ko.observable();
        self.otp = ko.observable();
        self.messageSection = ko.observable();
        self.pageSectionHeader = ko.observable();
        self.genericCompleteHandler = self.currentContext.complete;
        self.attemptsLeft = ko.observable(JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).attemptsLeft);
        self.resendsLeft = JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).resendsLeft;
        self.resentMsg = ko.observable(false);
        self.multipleInput = ko.observableArray();
        self.disableReferenceNumber = ko.observable(true);
        self.editReferenceNo = ko.observable(false);
        self.validationTracker = ko.observable();
        self.validationTrackerID = "validationTrackerID" + rootParams.baseModel.incrementIdCount();
        self.editReferenceNo.subscribe(function(newValue) {
            if (newValue) {
                self.disableReferenceNumber(false);
            } else {
                self.disableReferenceNumber(true);
            }
        });
        self.editTheReferenceNo = function() {
            if (self.editReferenceNo() === "true") {
                self.disableReferenceNumber(false);
            } else {
                self.disableReferenceNumber(true);
            }
        };
        if (self.scopeType() === "USER") {
            self.editReferenceNo(false);
        }
        if (rootParams.baseModel.cordovaDevice() === "ANDROID") {
            window.OTPAutoVerification.startOTPListener({
                delimiter: "otp:",
                length: 10
            }, function(result) {
                self.otp(result);
                window.OTPAutoVerification.stopOTPListener();
            }, function() {
                window.OTPAutoVerification.stopOTPListener();
            });
        }
        self.pageSectionHeader(self.locale.otpPageSection);
        self.messageSection(self.locale.message);
        var password = true;
        self.togglePassword = function() {
            password = !password;
            var eye = $("#eyecon");
            eye.removeClass("icon-eye icon-eye-slash");
            if (password) {
                eye.addClass("icon-eye-slash");
                $("#otp input").prop({
                    type: "password"
                });
            } else {
                eye.addClass("icon-eye");
                $("#otp input").prop({
                    type: "text"
                });
            }
        };
        self.completeOTP = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById(self.validationTrackerID))) {
                return;
            }
            var buildingResponseHeader = {};
            buildingResponseHeader.authType = "OTP";
            buildingResponseHeader.otp = self.otp();
            buildingResponseHeader.referenceNo = self.referenceNumber();
            self.currentContext.headers["X-CHALLENGE_RESPONSE"] = JSON.stringify(buildingResponseHeader);
            if (self.isNonce) {
                self.fireRequest(self.currentContext.headers["x-noncecount"], self.otp(), self.referenceNumber());
            } else {
                self.currentContext.success = self.completedOTP;
                self.fireRequest(self.currentContext).then(function(data) {
                    self.currentContext.promiseResolve(data);
                });
            }
        };
        self.completedOTP = function() {
            rootParams.baseModel.onTFAScreen(false);
            if (self.originalSuccess) {
                return self.originalSuccess.apply(this, Array.prototype.slice.call(arguments));
            }
        };
        self.cancelOTP = function() {
            rootParams.baseModel.onTFAScreen(false);
            if (!rootParams.baseModel.menuNavigationAvailable) {
                return $(document).trigger("2facancelled");
            }
            history.back();
        };
        self.disableResend = self.resendsLeft ? ko.observable(true) : ko.observable(false);
        self.reOTP = function() {
            self.otpSent(false);
            OTPModel.resendOTP(self.referenceNumber()).done(function() {
                self.otpSent(true);
                self.resendsLeft = self.resendsLeft - 1;
                if (!self.resendsLeft) {
                    self.disableResend(false);
                }
            });
        };
        self.resendComplete = function(jqXHR) {
            if (jqXHR.status === 400) {
                window.location.reload();
            }
            self.currentContext = jqXHR;
            self.genericCompleteHandler.apply(self.currentContext, [arguments]);
        };
        self.resendOTP = function() {
            self.currentContext.complete = self.resendComplete;
            if (self.isNonce) {
                self.fireRequest(self.currentContext.headers["x-noncecount"], self.otp(), self.referenceNumber());
            } else {
                self.currentContext.headers["X-TOKEN-REFNO"] = self.referenceNumber();
                self.fireRequest(self.currentContext);
            }
        };
        self.otpShown = function() {
            $("#otp").bind("cut copy paste contextmenu", function(e) {
                e.preventDefault();
            });
        };
    };
});
