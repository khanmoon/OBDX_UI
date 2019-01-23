define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/login-form"
], function (ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("login-options", "login");
        rootParams.baseModel.registerComponent("pin-login", "login");
        rootParams.baseModel.registerElement("virtual-keyboard");
        self.username = ko.observable();
        self.password = ko.observable();
        self.message = ko.observable();
        self.nls = ResourceBundle;
        self.showPopup = true;
        if (!rootParams.baseModel.large() || rootParams.baseModel.cordovaDevice()) {
            self.showPopup = false;
        }
        if (rootParams.data && rootParams.data.data && rootParams.data.data.landingModule) {
            self.landingModule = rootParams.data.data.landingModule;
        } else if (rootParams.landingModule) {
            self.landingModule = rootParams.landingModule;
        }
        self.cancelLogin = function () {
            history.back();
        };
        if (rootParams.baseModel.cordovaDevice()) {
            self.type = "login-form-mobile";
        } else {
            self.type = "login-form-web";
        }
        rootParams.baseModel.registerComponent(self.type, "login");
    };
});