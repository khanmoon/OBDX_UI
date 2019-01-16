define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/time-based-otp-screen",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation"
], function(ko, $, locale) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        self.referenceNumber = ko.observable(JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).referenceNo);
        self.attemptsLeft = JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).attemptsLeft;
        self.isNonce = !!self.currentContext.url.match("session/nonce");
        self.invalidTracker = ko.observable();
        self.totp = ko.observable();
        self.messageSection = ko.observable();
        self.pageSectionHeader = ko.observable();
        self.genericCompleteHandler = self.currentContext.complete;
        self.textboxArray = ko.observable();
        self.instructions = ko.observableArray(self.locale.instructions.split(","));
        self.nextTab = function(data, event) {
            var index = ko.contextFor(event.target).$index();
            if ((event.keyCode <= 57 && event.keyCode >= 48) || (event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode >= 65 && event.keyCode <= 90)) {
                $("#" + (index + 1)).focus();
            }
            if (event.keyCode === 8) {
                $("#" + (index - 1)).focus();
            }
        };
        self.scopeType = ko.observable(JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).scope);
        self.disableReferenceNumber = ko.observable(true);
        self.editReferenceNo = ko.observable(false);
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
        self.pageSectionHeader(self.locale.softTokenVerification);
        self.messageSection(self.locale.softTokenMessage);
        var password = true;
        self.togglePassword = function() {
            password = !password;
            var eye = $("#eyecon");
            eye.removeClass("icon-eye icon-eye-slash");
            if (password) {
                eye.addClass("icon-eye-slash");
                $(".oj-inputpassword-input").attr("type", "password");
            } else {
                eye.addClass("icon-eye");
                $(".oj-inputpassword-input").attr("type", "text");
            }
        };
        self.clearField = function() {
            self.textboxArray = "";
        };
        self.completeTOTP = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }
            var buildingResponseHeader = {};
            var enteredTOTP = "";
            var lengthOfOTP = self.textboxArray().split("");
            lengthOfOTP.forEach(function(element) {
                enteredTOTP = enteredTOTP + "" + element;
            });
            self.totp(enteredTOTP);
            buildingResponseHeader.authType = "T_SOFT_TOKEN";
            buildingResponseHeader.totp = enteredTOTP;
            buildingResponseHeader.referenceNo = self.referenceNumber();
            self.currentContext.headers["X-CHALLENGE_RESPONSE"] = JSON.stringify(buildingResponseHeader);
            if (self.isNonce) {
                self.fireRequest(self.currentContext.headers["x-noncecount"], enteredTOTP, self.referenceNumber());
            } else {
                self.currentContext.success = self.completedTOTP;
                self.fireRequest(self.currentContext).then(function(data) {
                    self.currentContext.promiseResolve(data);
                });
            }
        };
        self.completedTOTP = function() {
            rootParams.baseModel.onTFAScreen(false);
            if (self.originalSuccess) {
                return self.originalSuccess.apply(this, Array.prototype.slice.call(arguments));
            }
        };
        self.cancelTOTP = function() {
            rootParams.baseModel.onTFAScreen(false);
            if (!rootParams.baseModel.menuNavigationAvailable) {
                return $(document).trigger("2facancelled");
            }
            history.back();
        };
        self.totpShown = function() {
            $("#totp").bind("cut copy paste contextmenu", function(e) {
                e.preventDefault();
            });
        };
    };
});