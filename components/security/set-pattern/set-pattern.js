define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/set-pattern",
    "framework/js/constants/constants",
    "baseLogger",
    "json!local!./pin-pattern-max-attempts"
], function (oj, ko, $, ResourceBundle, CONSTANTS, baseLogger, MaxAttempts) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.patternLock);
        self.patternVisible = ko.observable();
        self.setPattern = ko.observable();
        var lockSet, mechanism;
        function dummyFunction() {
            baseLogger.info("this is a dummy function");
        }
        var patternVisisblitySubscription = self.patternVisible.subscribe(function (newValue) {
            if (newValue) {
                mechanism = "pattern-invisible";
            } else {
                mechanism = "pattern";
            }
        });
        self.dispose = function () {
            patternVisisblitySubscription.dispose();
        };
        self.appendPatternLock = function () {
            var setPinOnDraw = function (pattern) {
                self.setPattern(pattern);
            };
            require(["thirdPartyLibs/patternLock/patternLock"], function (PatternLock) {
                lockSet = new PatternLock("#patternContainerSet", {
                    radius: 20,
                    onDraw: setPinOnDraw,
                    patternVisible: true
                });
            });
        };
        self.appendPatternLock();
        self.enrollUser = function (secret) {
            mechanism = mechanism || "pattern";
            var errorCallback = function () {
                rootParams.baseModel.showMessages(null, [self.resource.couldntSetupPattern], "ERROR");
                self.goToDashboardOrConfirmScreen();
            };
            var successCallback = function () {
                window.plugins.appPreferences.store(function () {
                    window.plugins.auth.owner.set({ password: rootParams.dashboard.userData.userProfile.userName }).then(function () {
                        window.plugins.appPreferences.store(dummyFunction, dummyFunction, "max_attempts", MaxAttempts.maxAttempts);
                        self.goToDashboardOrConfirmScreen();
                    });
                }, errorCallback, "alternate_preference", mechanism);
            };
            window.plugins.auth.pattern.save({
                pin: self.setPattern(),
                password: secret
            }, successCallback, errorCallback);
        };
        self.undoSetPin = function () {
            lockSet.reset();
            self.setPattern("");
        };
        self.back = function () {
            rootParams.dashboard.hideDetails();
        };
        self.proceedForSetPattern = function () {
            if (self.setPattern().length > 3) {
                rootParams.baseModel.registerComponent("confirm-pattern", "security");
                rootParams.dashboard.loadComponent("confirm-pattern", {
                    setPattern: self.setPattern,
                    enrollUser: self.enrollUser,
                    JWTToken: rootParams.data.JWTToken,
                    baseModel: rootParams.baseModel
                }, self);
            } else {
                rootParams.baseModel.showMessages(null, [self.resource.pleaseEnterPattern], "ERROR");
            }
        };
        self.cancelSetPattern = function () {
            if (CONSTANTS.userSegment === "ANON") {
                self.changeUserSegment(self.userSegment, rootParams.dashboard.userData, self.landingModule);
            } else {
                rootParams.dashboard.switchModule(self.dashboardRole(), true);
            }
        };
    };
});
