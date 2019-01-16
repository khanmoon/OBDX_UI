define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/security-landing",
    "./model",
    "framework/js/constants/constants",
    "baseLogger",
    "platform",
    "ojs/ojinputtext"
], function (oj, ko, $, ResourceBundle, Model, CONSTANTS, BaseLogger, Platform) {
    "use strict";
    return function (rootParams) {

        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.verifyUser);
        self.password = self.password || ko.observable();
        self.type = self.params.type || rootParams.data.type;
        self.validationTracker = ko.observable();
        self.showScreen = ko.observable(false);
        self.landingModule = self.params.landingModule || null;
        rootParams.baseModel.registerComponent("set-pin", "security");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerElement("modal-window");
        self.nextComponentAlternateLogin = ko.observable();

        function getClientId(type) {
            var clientIDType;
            if (type === "siri") {
                clientIDType = "EXTENSION_CLIENT_ID";
            } else if (self.type === "wearableSetPin" || self.type === "wearableResetPin") {
                clientIDType = "WATCH_CLIENT_ID";
            } else {
                clientIDType = "APP_CLIENT_ID";
            }
            return new Promise(function (resolve, reject) {
                window.plugins.appPreferences.fetch(clientIDType).then(function (key) {
                    resolve(key);
                }).catch(function () {
                    reject();
                });
            });

        }

        function getAccessPointId(type) {
            var accessPointId;
            if (type === "siri") {
                accessPointId = "APSIRICHATBOT";
            } else if (self.type === "wearableSetPin" || self.type === "wearableResetPin") {
                accessPointId = "APWEARABLE";
            } else {
                accessPointId = "APMOBAPP";
            }
            return accessPointId;
        }

        function getDomain(type) {
            var domain;
            if (type === "siri") {
                domain = "OBDXSiriDomain";
            } else if (self.type === "wearableSetPin" || self.type === "wearableResetPin") {
                domain = "OBDXWearDomain";
            } else {
                domain = "OBDXMobileAppDomain";
            }
            return domain;
        }
        $("#password").ready(function () {
            $("#password").focus();
        });
        if (self.params.prelogin) {
            self.showScreen(false);
        } else {
            self.showScreen(true);
        }

        var isFPSupported = function (biometryType) {
            return new Promise(function (resolve, reject) {
                function isAvailableSuccess(result) {
                    if (result.isHardwareDetected) {
                        if(biometryType)
                               resolve(biometryType);
                        else
                               resolve();
                    } else {
                        reject();
                    }
                }
                window.plugins.auth.touchid.isAvailable(isAvailableSuccess);
            });
        };

        var saveSiriJWTtoken = function () {
            return new Promise(function (resolve, reject) {
                if (window.plugins.auth.siri) {
                    Platform.getInstance().then(function (platform) {
                        var serverType = self[platform("getServerType")];
                        serverType.getMobileJWTToken("siri").then(function (token) {
                            window.plugins.auth.siri.save(token, function () {
                                resolve();
                            }, function () {
                                reject();
                            });
                        }).catch(function () {
                            BaseLogger.error("ERROR IN GETTING SIRI JWT TOKEN");
                            reject();
                        });
                    });
                } else {
                    resolve();
                }
            });
        };
        self.proceed = function () {
            $("#requestPermision").trigger("closeModal");
            Platform.getInstance().then(function (platform) {
                var serverType = self[platform("getServerType")];
                serverType.getMobileJWTToken().then(function (token) {
                    self.registerDevice().then(function () {
                        if (self.type === "pin") {
                            self.data = {
                                JWTToken: token,
                                landingModule: self.landingModule
                            };
                            self.nextComponentAlternateLogin("set-pin");
                        } else if (self.type === "pattern") {
                            rootParams.baseModel.registerComponent("set-pattern", "security");
                            self.data = {
                                JWTToken: token,
                                landingModule: self.landingModule
                            };
                            self.nextComponentAlternateLogin("set-pattern");
                        } else if (self.type === "touchID" || self.type === "faceID") {
                           var biometryType;
                           if(self.type === "faceID")
                            biometryType = "faceid";
                           else
                            biometryType = "touchid";
                            isFPSupported(biometryType).then(function (biometryType) {
                                self.enrollUser(token,biometryType);
                            });
                        } else if (self.type === "wearableSetPin" || self.type === "wearableResetPin") {
                            rootParams.baseModel.registerComponent("set-wearable-pin", "security");
                            self.data = {
                                JWTToken: token,
                                landingModule: self.landingModule,
                                type: self.type
                            };
                            self.enableWearableAccesspoint().then(function () {
                                self.nextComponentAlternateLogin("set-wearable-pin");
                            });
                        }
                    }).catch(function (ex) {
                        BaseLogger.error(ex.message);
                        rootParams.baseModel.showMessages(null, [ex.message], "ERROR");
                    });
                }).catch(function (ex) {
                    BaseLogger.error(ex.message);
                    rootParams.baseModel.showMessages(null, [ex.message], "ERROR");
                });
            });
        };
        self.OAM = {
            getMobileJWTToken: function () {
                return new Promise(function (resolve, reject) {
                    var inputpassword;
                    if (self.params.prelogin) {
                        inputpassword = self.params.password;
                    } else {
                        inputpassword = self.password();
                    }
                    Platform.getInstance().then(function (platform) {
                        var url = platform("getOAMURL") + "/oic_rest/rest/jwtoamauthentication/authenticate";
                        window.cordovaFetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "User-Agent": "OIC-Authentication",
                                "X-IDAAS-SERVICEDOMAIN": "Default"
                            },
                            body: JSON.stringify({
                                "X-Idaas-Rest-Subject-Type": "USERCREDENTIAL",
                                "X-Idaas-Rest-Subject-Username": rootParams.dashboard.userData.userProfile.userName,
                                "X-Idaas-Rest-Subject-Password": inputpassword,
                                "X-Idaas-Rest-New-Token-Type-To-Create": "USERTOKEN::JWTUT"
                            })
                        }).then(function (response) {
                            if (response.status === 200) {
                                resolve(JSON.parse(response.statusText)["X-Idaas-Rest-Token-Value"]);
                            } else {
                                $(".se-pre-con").fadeOut();
                                if (response.status === 401) {
                                    rootParams.baseModel.showMessages(null, [self.resource.invalidCredentials], "ERROR");
                                    self.password("");
                                } else {
                                    rootParams.baseModel.showMessages(null, [self.resource.login_error], "ERROR");
                                }
                                reject();
                            }
                        }).catch(function (ex) {
                            BaseLogger.error(ex.message);
                            rootParams.baseModel.showMessages(null, [ex], "ERROR");
                            reject();
                        });
                    });
                });
            }
        };
        self.NONOAM = {
            getMobileJWTToken: function (type) {
                return new Promise(function (resolve, reject) {
                    var payload = {};
                    payload.accessPointId = getAccessPointId(type);

                    payload.password = self.params.prelogin ? self.params.password : self.password();
                    payload = ko.toJSON(payload);
                    Model.getJwtToken(payload).done(function (data) {
                        resolve(data.jwtoken);
                    }).fail(function () {
                        $(".se-pre-con").fadeOut();
                        rootParams.baseModel.showMessages(null, [self.resource.login_error], "ERROR");
                        self.password("");
                        reject();
                    });
                });
            }
        };

        self.OAUTH = {
            getMobileJWTToken: function (type) {
                return new Promise(function (resolve, reject) {
                    Platform.getInstance().then(function (platform) {
                        var inputpassword;
                        if (self.params.prelogin) {
                            inputpassword = self.params.password;
                        } else {
                            inputpassword = self.password();
                        }
                        var url = platform("getOAUTHProviderURL");
                        var offline_scope = platform("getOfflineScope");
                        getClientId(type).then(function (clientID) {
                            window.cordovaFetch(url, {
                                method: "POST",
                                redirect: false,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Authorization": "Basic " + clientID,
                                    "X-OAUTH-IDENTITY-DOMAIN-NAME": getDomain(type)
                                },
                                body: "grant_type=password&username=" + rootParams.dashboard.userData.userProfile.userName + "&password=" + inputpassword + "&scope=" + offline_scope
                            }).then(function (response) {
                                if (response.status === 200) {
                                    resolve(JSON.parse(response.statusText).refresh_token);
                                } else {
                                    rootParams.baseModel.showMessages(null, [self.resource.invalidCredentials], "ERROR");
                                    reject({
                                        message: "GET REFRESH TOKEN FAILED"
                                    });
                                }
                            }).catch(function (ex) {
                                $(".se-pre-con").fadeOut();
                                BaseLogger.error(ex.message);
                                reject({
                                    message: "GET REFRESH TOKEN FAILED"
                                });
                            });
                        });
                    }).catch(function (ex) {
                        $(".se-pre-con").fadeOut();
                        BaseLogger.error(ex.message);
                        rootParams.baseModel.showMessages(null, [ex], "ERROR");
                        reject();
                    });
                });
            }
        };
        self.registerDevice = function () {
            return new Promise(function (resolve, reject) {
                var payload = {};
                if (rootParams.baseModel.cordovaDevice() === "ANDROID") {
                    payload.osVersion = window.device.version;
                    payload.os = window.device.platform.toUpperCase();
                    payload.manufacturer = window.device.manufacturer;
                    payload.model = window.device.model;
                    payload.secureDeviceId = window.device.uuid;
                    payload = ko.toJSON(payload);
                    Model.registerDevice(payload).then(function () {
                        resolve();
                    });
                } else if (rootParams.baseModel.cordovaDevice() === "IOS") {
                    window.DeviceCompliance.getDeviceInfo(function (info) {
                        payload = ko.toJSON(info);
                        Model.registerDevice(payload).then(function () {
                            resolve();
                        });
                    }, function () {
                        reject();
                    });
                }
            });
        };
        self.enableWearableAccesspoint = function () {
            return new Promise(function (resolve, reject) {
                Model.getMePreference().then(function (data) {
                    var mePreference = data;
                    delete mePreference.status;
                    ko.utils.arrayForEach(mePreference.userAccessPointRelationship, function (item) {
                        if (CONSTANTS.currentEntity === item.determinantValue && item.accessPointId === "APWEARABLE") {
                            item.status = true;
                        }
                    });
                    Model.updateMePreference(ko.mapping.toJSON(mePreference)).then(function () {
                        resolve();
                    }).catch(function () {
                        reject();
                    });
                }).catch(function () {
                    reject();
                });
            });
        };
        self.enrollUser = function (secret, biometryType) {
            biometryType = biometryType || "touchid";
            var encryptConfig = {
                "password": secret,
                "disableBackup": true,
                "maxAttempts": 5
            };
            var successCallbacktouchId = function () {
                window.plugins.appPreferences.store(function () {
                    window.plugins.auth.owner.set({
                        password: rootParams.dashboard.userData.userProfile.userName
                    }).then(function () {
                        if (rootParams.baseModel.cordovaDevice() === "IOS") {
                            saveSiriJWTtoken().then(function () {
                                self.savePayees();
                                self.goToDashboardOrConfirmScreen();
                            });
                        } else {
                            self.goToDashboardOrConfirmScreen();
                        }
                    });
                }, function errorCallback() {
                    rootParams.baseModel.showMessages(null, [self.resource.errors.fp_error], "ERROR");
                    self.goToDashboardOrConfirmScreen();
                }, "alternate_preference", biometryType);
            };
            var errorCallback = function (error) {
                if (error === "Cancelled") {
                    rootParams.baseModel.showMessages(null, [self.resource.errors.fp_cancelled], "ERROR");
                } else if (error === "Fingerprint_Changed") {
                    rootParams.baseModel.showMessages(null, [self.resource.errors.fp_changed], "ERROR");
                } else {
                    rootParams.baseModel.showMessages(null, [self.resource.errors.fp_error], "ERROR");
                }
                self.goToDashboardOrConfirmScreen();
            };
            window.plugins.auth.touchid.save(encryptConfig, successCallbacktouchId, errorCallback);
        };
        self.cancelClickHandler = function () {
            if (CONSTANTS.userSegment === "ANON") {
                if (self.params.genericViewModel) {
                    self.params.genericViewModel.changeUserSegment(self.userSegment, rootParams.dashboard.userData, self.landingModule);
                }
            } else {
                rootParams.dashboard.switchModule();
            }
        };
        self.goToDashboardOrConfirmScreen = function () {
            if (!(rootParams.dashboard.userData.firstLoginFlowDone === undefined || rootParams.dashboard.userData.firstLoginFlowDone)) {
                self.incrementloadedComponentId();
                return;
            }
            if (CONSTANTS.userSegment === "ANON") {
                var landingURL = "./index.html";
                if (self.landingModule) {
                    landingURL = landingURL + "?module=" + self.landingModule;
                }
                window.location.assign(landingURL);
            } else {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: {
                        status: 200,
                        responseJSON: {
                            status: {
                                referenceNumber: ""
                            }
                        }
                    },
                    hostReferenceNumber: "",
                    transactionName: rootParams.dashboard.headerName(),
                    template: "confirm-screen/security"
                }, self);
            }
        };
        self.savePayees = function () {
            Model.getPayeeList().done(function (data) {
                var payeeArray = [];
                for (var i = 0; i < data.payeeGroups.length; i++) {
                    for (var j = 0; j < data.payeeGroups[i].listPayees.length; j++) {
                        payeeArray.push(data.payeeGroups[i].listPayees[j].nickName);
                    }
                }
                window.plugins.auth.siri.savePayees(data, payeeArray);
            });
        };
        self.openPermission = function () {
            $("#requestPermision").ready(function () {
                $("#requestPermision").trigger("openModal");
            });
        };
        if (self.params.prelogin || self.password()) {
            self.openPermission();
        }
    };
});
