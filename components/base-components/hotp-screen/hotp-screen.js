define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/hotp-screen",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojknockout-validation"
], function(ko, $, locale) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
        var serverResponse = JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE"));
        self.referenceNumber = ko.observable(serverResponse.referenceNo);
        self.attemptsLeft = ko.observable(serverResponse.attemptsLeft);
        self.invalidTracker = ko.observable();
        self.hotp = ko.observable();
        self.messageSection = ko.observable();
        self.pageSectionHeader = ko.observable();
        self.genericCompleteHandler = self.currentContext.complete;
        self.textboxArray = ko.observable();
        var enteredHOTP = "";
        self.instructions = ko.observableArray(self.locale.instructions.split(","));
        self.randomNumber = ko.observable(serverResponse.randomNumber);
        self.nextTab = function(data, event) {
            var index = ko.contextFor(event.target).$index();
            if ((event.keyCode <= 57 && event.keyCode >= 48) || (event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode >= 65 && event.keyCode <= 90)) {
                $("#" + (index + 1)).focus();
            }
            if (event.keyCode === 8) {
                $("#" + (index - 1)).focus();
            }
        };
        self.pageSectionHeader(self.locale.softTokenVerification);
        self.messageSection(self.locale.softTokenMessage);
        var password = true;
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
            ko.utils.forEach(self.textboxArray(), function(element) {
                element.fieldValue = "";
            });
        };
        self.completeHOTP = function() {
            if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }
            var buildingResponseHeader = {};
            var lengthOfOTP = self.textboxArray().split("");
            ko.utils.arrayForEach(lengthOfOTP, function(element) {
                enteredHOTP = enteredHOTP + "" + element;
            });
            self.hotp(enteredHOTP);
            buildingResponseHeader.authType = "R_SOFT_TOKEN";
            buildingResponseHeader.hotp = enteredHOTP;
            buildingResponseHeader.referenceNo = self.referenceNumber();
            self.currentContext.headers["X-CHALLENGE_RESPONSE"] = JSON.stringify(buildingResponseHeader);
            if (self.isNonce) {
                self.fireRequest(self.currentContext.headers["x-noncecount"], enteredHOTP, self.referenceNumber());
            } else {
                self.currentContext.success = self.completedHOTP;
                self.fireRequest(self.currentContext).then(function(data) {
                    self.currentContext.promiseResolve(data);
                });
            }
        };
        self.completedHOTP = function() {
            rootParams.baseModel.onTFAScreen(false);
            if (self.originalSuccess) {
                return self.originalSuccess.apply(this, Array.prototype.slice.call(arguments));
            }
        };
        self.cancelHOTP = function() {
            rootParams.baseModel.onTFAScreen(false);
            if (!rootParams.baseModel.menuNavigationAvailable) {
                return $(document).trigger("2facancelled");
            }
            history.back();
        };
        self.hotpShown = function() {
            $("#totp").bind("cut copy paste contextmenu", function(e) {
                e.preventDefault();
            });
        };
    };
});