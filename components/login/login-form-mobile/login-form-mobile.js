define([
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "thirdPartyLibs/ochat/min/ochat-widget",
  "baseLogger",
  "platform",
  "ojs/ojbutton",
  "ojs/ojinputtext",
  "ojs/ojswitch"
], function(ko, $, LoginModel, Constants, oChat, BaseLogger, Platform) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.alternateLogin = ko.observable(false);
    rootParams.baseModel.registerComponent("pin-login", "login");
    rootParams.baseModel.registerComponent("alternate-login", "login");
    rootParams.baseModel.registerComponent("login-options", "login");
    rootParams.dashboard.headerName(self.nls.loginForm.labels.login);
    self.oam_url = self.server_url = null;
    var loginFns = null;
    Platform.getInstance().then(function(platform) {
      self.server_url = platform("getServerURL");
      self.oam_url = platform("getOAMURL");
      self.oauth_Provider_URL = platform("getOAUTHProviderURL");
      self.login_scope = platform("getLoginScope");
      self.offline_scope = platform("getOfflineScope");
      self.x_token_type = platform("getXTokenType");
      loginFns = platform("login", rootParams.baseModel.showMessages);
    });
    self.storedJWT = null;
    self.oamUserToken = null;
    self.user_token = null;
    self.contextId = null;
    self.userSegment = null;
    self.optForAlternateLogin = self.optForAlternateLogin || ko.observable(false);
    self.showAccountSnapshot = ko.observable(true);
    self.showLoginOptions = ko.observable(false);
    self.showAlternateLogin = ko.observable(false);
    self.showAlternativeSwitch = ko.observable(true);
    self.genericViewModel = rootParams.root;
    if (self.landingModule) {
      self.showAccountSnapshot(false);
      if (self.hideMobileLanding) {
        self.hideMobileLanding(true);
      }

    }
    var dummyFunction = function() {
      BaseLogger.info("this is a dummy function");
    };
    if (self.queryMap) {
      if (self.queryMap.p_error_code !== null && self.queryMap.p_error_code === "OAM-10") {
        self.message(self.nls.loginForm.validationMsgs.errrorOAM10);
      } else if (self.queryMap.p_error_code !== null && self.queryMap.p_error_code === "OAM-5") {
        self.message(self.nls.loginForm.validationMsgs.errrorOAM5);
      } else if (self.queryMap.p_error_code) {
        self.message(self.nls.loginForm.validationMsgs.invalidCredentials);
      }
    }

    self.afterRender = function(genericViewModel) {
      if (genericViewModel.queryMap) {
        if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OAM-10") {
          self.message(self.nls.loginForm.validationMsgs.errrorOAM10);
        } else if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OAM-5") {
          self.message(self.nls.loginForm.validationMsgs.errrorOAM5);
        } else if (genericViewModel.queryMap.p_error_code !== null && genericViewModel.queryMap.p_error_code === "OBDXIDM-0") {
          self.message(genericViewModel.queryMap.p_error_message);
        } else if (genericViewModel.queryMap.p_error_code) {
          self.message(self.nls.loginForm.validationMsgs.invalidCredentials);
        }
      }
    };
    self.onSnapshotClick = function() {
      var accountSnapshotSuccess = function(value) {
        if (value === "REGISTERED") {
          window.plugins.auth.snapshot.fetch({
            pin: "SNAPSHOT"
          }, function(snapshotToken) {
            self.landingComponent = "account-snapshot";
            LoginModel.sessionCreate().then(function() {
              Platform.getInstance().then(function(platform) {
                var serverType = self[platform("getServerType")];
                serverType.getAccessTokenForSnapshot(snapshotToken).then(function(tokens) {
                  self.accessService({
                    accessToken: tokens.accessToken,
                    domain: "OBDXSnapshotDomain"
                  });
                });
              });
            });
          }, dummyFunction);
        } else {
          rootParams.baseModel.registerComponent("account-snapshot-registration", "accounts");
          rootParams.dashboard.loadComponent("account-snapshot-registration", {}, self);
        }
      };
      window.plugins.appPreferences.fetch(accountSnapshotSuccess, function() {
        BaseLogger.info("account snapshot failed");
      }, "account_snapshot_status");
    };
    if (document.getElementById("login_username")) {
      document.getElementById("login_username").onkeypress = function(e) {
        if (e.which === 13) {
          $("#login_password").focus();
        }
      };
    }
    if (document.getElementById("login_password")) {
      document.getElementById("login_password").onkeypress = function(e) {
        if (e.which === 13) {
          $("#login-button").focus();
        }
      };
    }
    self.onLogin = function() {
      loginFns.getUserToken.call(self);
    };
    var error = function() {
      self.showAlternativeSwitch(true);
    };
    var get_login_preference = function(value) {
      if (value && (value.indexOf("pin") === 0 || value.indexOf("pattern") === 0 || value === "touchid" || value === "faceid")) {
        self.alternateLogin(value);
        self.showAlternativeSwitch(false);
      } else {
        error();
      }
    };
    window.plugins.appPreferences.fetch(get_login_preference, error, "alternate_preference");
    self.openAlternateLogin = function() {
      self.showAlternateLogin(false);
      ko.tasks.runEarly();
      self.showAlternateLogin(true);
    };
    var getTheToken = function() {
      window.FCMPlugin.getToken(function(token) {
        if (token) {
          window.plugins.appPreferences.store(dummyFunction, dummyFunction, "registration_token", token);
        } else {
          setTimeout(getTheToken, 1000);
        }
      }, dummyFunction);
    };
    if (rootParams.baseModel.cordovaDevice() === "ANDROID") {
      var pushOptSelected = false;
      var push_status_success = function(value) {
        if (value === null || value === "") {
          $("#customPopupforPushNotification").trigger("openModal");
        }
      };
      self.enablePush = function() {
        pushOptSelected = true;
        window.plugins.appPreferences.store(dummyFunction, dummyFunction, "push_status", "ALLOWED");
        setTimeout(getTheToken, 1000);
        $("#customPopupforPushNotification").trigger("closeModal");
      };
      self.disablePush = function() {
        pushOptSelected = true;
        window.plugins.appPreferences.store(dummyFunction, dummyFunction, "push_status", "DISALLOWED");
        $("#customPopupforPushNotification").trigger("closeModal");
      };
      self.showDialog = function() {
        window.plugins.appPreferences.fetch(push_status_success, dummyFunction, "push_status");
      };
      self.closeHandler = function() {
        if (!pushOptSelected) {
          navigator.app.exitApp();
        }
      };
    }
    self.accessService = function(accessToken, isAlternateLogin) {
      Platform.getInstance().then(function(platform) {
        loginFns = platform("login", rootParams.baseModel.showMessages);
        var headers = loginFns.accessServicePreHook(accessToken);
        LoginModel.me(headers).done(function(data) {
          Constants.currentEntity = data.userProfile.homeEntity;
          $.extend(rootParams.dashboard.userData, data);
          if ($.inArray("RetailUser", data.userProfile.roles) > -1) {
            self.userSegment = "RETAIL";
          } else if ($.inArray("CorporateUser", data.userProfile.roles) > -1) {
            self.userSegment = "CORP";
          }

          if (!(rootParams.dashboard.userData.firstLoginFlowDone === undefined || rootParams.dashboard.userData.firstLoginFlowDone)) {
            if (self.landingModule) {
              $("#firstTimeLoginNotCompleted").fadeIn();
            } else {
              rootParams.baseModel.switchPage({
                homeComponent: {
                  component: "configuration-base",
                  module: "user-login-configuration"
                },
                internal: true
              }, false, false);
            }
          } else if (self.optForAlternateLogin()) {
            self.showLoginOptions(true);
          } else if (self.landingComponent === "account-snapshot") {
            window.plugins.appPreferences.fetch(function(data) {
              if (data === "PENDING") {
                self.enableAccountSnapshotAccesspoint().then(function() {
                  Platform.getInstance().then(function(platform) {
                    var serverType = self[platform("getServerType")];
                    serverType.getSnapshotJWTToken().then(function(tokens) {
                      var refToken = (tokens.refreshToken) ? tokens.refreshToken : tokens.accessToken;
                      window.plugins.auth.snapshot.save({
                        pin: "SNAPSHOT",
                        password: refToken
                      }, function() {
                        window.plugins.appPreferences.store(function() {
                          if (rootParams.rootModel.allowSnapshot()) {
                            window.Wearable.onConnect(
                              function(resultData) {
                                var payload = {};
                                payload.secureDeviceId = resultData.wear_id;
                                payload.osVersion = resultData.wear_sdk;
                                payload.os = rootParams.baseModel.cordovaDevice() + "_WEAR";
                                payload.manufacturer = resultData.wear_manufacturer;
                                payload.model = resultData.wear_model;
                                payload = ko.mapping.toJSON(payload);
								serverType.getSnapshotJWTToken().then(function(tokens){
                                LoginModel.registerDevice(payload).done(function() {
                                  var wearablePayload = {};
                                  wearablePayload.snapshotJwt = (tokens.refreshToken) ? tokens.refreshToken : tokens.accessToken;
                                  LoginModel.updateSession().then(function() {
                                    window.Wearable.sendSnapshotToken(function() {
                                      self.accessService({
                                        accessToken: tokens.accessToken,
                                        domain: "OBDXSnapshotDomain"
                                      });
                                    }, function(error) {
                                      rootParams.baseModel.showMessages(null, [self.nls.errors[error]], "ERROR");
                                      self.updateSessionforSnapshot(tokens.accessToken);
                                    }, wearablePayload);
                                  });
                                });
								});
                              },
                              function(error) {
                                rootParams.baseModel.showMessages(null, [self.nls.errors[error]], "ERROR");
                                self.updateSessionforSnapshot(tokens.accessToken);
                              });
                          } else {
                            self.updateSessionforSnapshot(tokens.accessToken);
                          }
                        }, dummyFunction, "account_snapshot_status", "REGISTERED");
                      }, dummyFunction);
                    });
                  });
                });
              } else if (data === "REGISTERED") {
                self.genericViewModel.isUserDataSet(true);
                rootParams.baseModel.switchPage({
                  homeComponent: {
                    component: "account-snapshot",
                    module: "accounts"
                  },
                  internal: true
                }, false, false);
              }
            }, dummyFunction, "account_snapshot_status");
          } else if (self.landingModule && self.landingComponent) {
            rootParams.baseModel.switchPage({
              homeComponent: {
                component: self.landingComponent,
                module: self.landingModule
              },
              internal: true
            }, false, false);
          } else {
            rootParams.baseModel.switchPage({
              internal: true
            }, false, false);
          }
        }).fail(function(data) {
          if (data.status === 401) {
            $(".message-box-message__item").ready(function() {
              if (isAlternateLogin) {
                $(".message-box-message__item")[0].innerHTML = self.nls.loginForm.labels.fp_token_invalid;
                self.alternateLogin(false);
                self.showAlternativeSwitch(true);
              } else {
                $(".message-box-message__item")[0].innerHTML = self.nls.loginForm.validationMsgs.invalidCredentials;
              }
            });
          }
        });
      });
    };


    self.OAM = {
      getSnapshotJWTToken: function() {
        return new Promise(function(resolve, reject) {
          Platform.getInstance().then(function(platform) {
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
                "X-Idaas-Rest-Subject-Username": self.username(),
                "X-Idaas-Rest-Subject-Password": self.password(),
                "X-Idaas-Rest-New-Token-Type-To-Create": "USERTOKEN::JWTUT"
              })
            }).then(function(response) {
              if (response.status === 200) {
                resolve({
                  accessToken: JSON.parse(response.statusText)["X-Idaas-Rest-Token-Value"]
                });
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
            }).catch(function(ex) {
              BaseLogger.error(ex.message);
              rootParams.baseModel.showMessages(null, [ex], "ERROR");
              reject();
            });
          });
        });
      }
    };
    self.NONOAM = {
      getSnapshotJWTToken: function() {
        return new Promise(function(resolve, reject) {
          var payload = {};
          payload.accessPointId = "APSNAPSHOT";
          payload.password = self.password();
          payload = ko.toJSON(payload);
          LoginModel.getJwtToken(payload).done(function(data) {
            resolve({
              accessToken: data.jwtoken
            });
          }).fail(function() {
            $(".se-pre-con").fadeOut();
            rootParams.baseModel.showMessages(null, [self.resource.login_error], "ERROR");
            self.password("");
            reject();
          });
        });
      },
      getAccessTokenForSnapshot: function(token) {
        return new Promise(function(resolve) {
          resolve({
            accessToken: token
          });
        });
      }
    };

    self.OAUTH = {
      getSnapshotJWTToken: function(refreshToken) {
        return new Promise(function(resolve, reject) {
          Platform.getInstance().then(function(platform) {
            var body = refreshToken ? "grant_type=refresh_token&refresh_token=" + encodeURIComponent(refreshToken) : "grant_type=password&username=" + self.username() + "&password=" + self.password() + "&scope=" + self.offline_scope;
            window.plugins.appPreferences.fetch("SNAPSHOT_CLIENT_ID").then(function(clientID) {
              var url = platform("getOAUTHProviderURL");
              window.cordovaFetch(url, {
                method: "POST",
                redirect: false,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  "Authorization": "Basic " + clientID,
                  "X-OAUTH-IDENTITY-DOMAIN-NAME": "OBDXSnapshotDomain"
                },
                body: body
              }).then(function(response) {
                var responseText = JSON.parse(response.statusText);
                if (refreshToken) {
                  if (responseText.refresh_token) {
                    window.plugins.auth.snapshot.save({
                      pin: "SNAPSHOT",
                      password: responseText.refresh_token
                    });
                  }
                  resolve({
                    accessToken: responseText.access_token
                  });
                } else {
                  resolve({
                    accessToken: responseText.access_token,
                    refreshToken: responseText.refresh_token
                  });
                }
              }).catch(function(ex) {
                $(".se-pre-con").fadeOut();
                BaseLogger.error(ex.message);
                reject({
                  message: "GET REFRESH TOKEN FAILED"
                });
              });
            });
          }).catch(function(ex) {
            $(".se-pre-con").fadeOut();
            BaseLogger.error(ex.message);
            rootParams.baseModel.showMessages(null, [ex], "ERROR");
            reject();
          });
        });
      },
      getAccessTokenForSnapshot: function(refreshToken) {
        return self.OAUTH.getSnapshotJWTToken(refreshToken);
      }
    };

    self.enableAccountSnapshotAccesspoint = function() {
      return new Promise(function(resolve, reject) {
        LoginModel.getMePreference().then(function(data) {
          var mePreference = data;
          delete mePreference.status;
          ko.utils.arrayForEach(mePreference.userAccessPointRelationship, function(item) {
            if (Constants.currentEntity === item.determinantValue && item.accessPointId === "APSNAPSHOT") {
              item.status = true;
            }
          });
          LoginModel.updateMePreference(ko.mapping.toJSON(mePreference)).then(function() {
            Platform.getInstance().then(function(platform) {
              platform("registerDevice").then(function() {
                resolve();
              }).catch(function() {
                BaseLogger.error("REGISTER DEVICE FAILED");
              });
            });
          }).catch(function() {
            reject();
          });
        }).catch(function() {
          reject();
        });
      });
    };
    self.updateSessionforSnapshot = function(headerPayload) {
      LoginModel.updateSession().then(function() {
        self.accessService({
          accessToken: headerPayload,
          domain: "OBDXSnapshotDomain"
        });
      });
    };
    self.goToLogin = function() {
      rootParams.dashboard.switchModule("login");
      $("#firstTimeLoginNotCompleted").trigger("closeModal");
    };

    if (window.facebookConnectPlugin)
      window.facebookConnectPlugin.logout();
    self.forgotPass = function() {
      Platform.getInstance().then(function(platform) {
        window.open(platform("getServerURL", true) + "/index.html?homeComponent=user-information&homeModule=recovery&context=index", "_system");
      });
    };
    self.forgotUserId = function() {
      Platform.getInstance().then(function(platform) {
        window.open(platform("getServerURL", true) + "/index.html?homeComponent=user-recovery-info&homeModule=recovery&context=index", "_system");
      });
    };
    $(document).on("blur", "#login-button", function() {
      $("input[name='username']").focus();
    });
    $(".footer").addClass("white-background");
  };
});
