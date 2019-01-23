define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/set-pin",
    "json!local!./pin-pattern-max-attempts",
    "baseLogger",
    "ojs/ojbutton",
    "ojs/ojinputtext"
], function(oj, ko, $, ResourceBundle, MaxAttempts, baseLogger) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.setPin);
        self.maxlength = self.maxlength || ko.observable(4);
        self.setPin = ko.observable();
        self.confirmPin = ko.observable();
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("confirm-screen");
        self.menuItems = [{
                label: rootParams.baseModel.format(self.resource.pinPasscode, { number: 4 }),
                value: 4
            },
            {
                label: rootParams.baseModel.format(self.resource.pinPasscode, { number: 6 }),
                value: 6
            }
        ];

        function dummyFunction() {
            baseLogger.info("this is a dummy function");
        }
        $("#setPin").ready(function() {
            $("#setPin").attr("type", "tel");
        });
        var re;
        self.setPinProceed = function(event) {
            if (event.detail.value.length === self.maxlength()) {
                if (self.maxlength() === 6) { re = new RegExp("^([0-9]{6})$"); } else { re = new RegExp("^([0-9]{4})$"); }
                if (re.test(event.detail.value)) {
                    self.setPin(event.detail.value);
                    rootParams.baseModel.registerComponent("confirm-pin", "security");
                    rootParams.dashboard.loadComponent("confirm-pin", {
                        maxlength: self.maxlength,
                        setPin: self.setPin,
                        JWTToken: rootParams.data.JWTToken
                    }, self);
                } else {
                    rootParams.baseModel.showMessages(null, [self.resource.pinShouldhaveOnlyNumber], "ERROR");
                    $(".set-pin-input").find("input").val("");
                }
            }
        };
        self.openMenu = function(model, event) {
            document.getElementById("menuLauncher-container").open(event);
        };
        self.menuItemSelect = function(event) {
            self.maxlength(parseInt(event.target.value));
        };
        self.showWarning = function() {
            $("#backWarning").trigger("openModal");
        };
        self.hideWarning = function() {
            $("#backWarning").hide();
        };
        self.back = function() {
            rootParams.dashboard.hideDetails();
        };
        self.confirmPinProceed = function() {
            if (self.confirmPin().length === self.maxlength()) {
                if (self.setPin() === self.confirmPin()) {
                    self.registerDevice().then(function() {
                        self.enrollUser(rootParams.data.JWTToken);
                    });
                } else {
                    $("#confirmPin").addClass("red-font");
                    setTimeout(function() {
                        self.confirmPin("");
                        $("#confirmPin").removeClass("red-font");
                    }, 500);
                }
            }
        };
        self.enrollUser = function(secret) {
            var mechanism = "pin-" + self.maxlength();
            var errorCallback = function() {
                rootParams.baseModel.showMessages(null, [self.resource.couldntSetupPin], "ERROR");
                self.goToDashboardOrConfirmScreen();
            };
            var successCallbackAndroid = function() {
                window.plugins.appPreferences.store(function() {
                    window.plugins.auth.owner.set({ password: rootParams.dashboard.userData.userProfile.userName }).then(function() {
                        window.plugins.appPreferences.store(dummyFunction, dummyFunction, "max_attempts", MaxAttempts.maxAttempts);
                        self.goToDashboardOrConfirmScreen();
                    });
                }, errorCallback, "alternate_preference", mechanism);
            };
            window.plugins.auth.pin.save({
                pin: self.setPin(),
                password: secret
            }, successCallbackAndroid, errorCallback);
        };
    };
});