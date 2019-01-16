define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/login-options",
    "./model",
    "ojs/ojradioset"
], function(ko, $, resourceBundle, Model) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerComponent("security-landing", "security");
        self.firstTimeLoginFlow = ko.observable(rootParams.firstTimeLoginFlow);
        self.resource = resourceBundle;
        self.password = ko.observable(rootParams.password());
        self.selectedLoginType = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.listItem = [{
                id: "pin",
                iconImage: "security/manage-pin.svg"
            },
            {
                id: "pattern",
                iconImage: "security/manage-pattern.svg"
            }
        ];
        if (rootParams.baseModel.cordovaDevice()) {
            window.plugins.auth.touchid.isAvailable(function(data) {
                //check for touchid
                if (data.biometryType === "faceid")
                    self.listItem.push({
                        id: "faceID",
                        iconImage: "security/face-id.svg"
                    });
                else
                    self.listItem.push({
                        id: "touchID",
                        iconImage: "security/touchID.svg"
                    });

                self.dataLoaded(true);
            }, function() {
                self.dataLoaded(true);
            });
        } else {
            self.dataLoaded(true);
        }
        self.proceed = function() {
            rootParams.dashboard.loadComponent("security-landing", {
                prelogin: true,
                type: self.selectedLoginType(),
                password: self.password(),
                landingModule: self.landingModule || null
            }, self);
        };
        self.hideWarning = function() {
            $("#loginMethod").hide("openModal");
            if (self.firstTimeLoginFlow()) {
                self.loadNextComponent();
            }
        };
        self.showLoginOptionsDialog = function() {
            $("#loginMethod").trigger("openModal");
            $("#loginMethod").focus();
        };
        self.selectedLoginType.subscribe(function(menuOption) {
            if (self.firstTimeLoginFlow()) {
                var payload = ko.toJSON({ loginConfigId: self.loginConfigId() });
                Model.createLoginConfig(payload).done(function() {
                    rootParams.dashboard.loadComponent("security-landing", {
                        prelogin: true,
                        type: menuOption,
                        password: self.password(),
                        landingModule: self.landingModule,
                        genericViewModel: rootParams.root
                    }, self);
                });
            } else {
                rootParams.dashboard.loadComponent("security-landing", {
                    prelogin: true,
                    type: menuOption,
                    password: self.password(),
                    landingModule: self.landingModule,
                    genericViewModel: rootParams.root
                }, self);
            }
        });
    };
});