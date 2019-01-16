define([
  "knockout",
  "jquery",

  "platform",
  "baseLogger",
  "framework/js/constants/constants",
  "./model"
], function(ko, $, Platform, BaseLogger, Constants, Model) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.typeOfLogin = ko.observable();
    self.dataForParams = null;
    rootParams.baseModel.registerComponent("pin-login", "login");
    rootParams.baseModel.registerComponent("pattern-login", "login");
    Platform.getInstance().then(function(platform) {
      self.server_url = platform("getServerURL");
      self.oam_url = platform("getOAMURL");
      self.oauth_Provider_URL = platform("getOAUTHProviderURL");
    });
    self.storedJWT = ko.observable();
    var dummyFunction = function() {
      BaseLogger.info("this is a dummy function");
    };
    self.validateJWTToken = function() {
      Platform.getInstance().then(function(platform) {
        var serverType = self[platform("getServerType")];
        serverType.validateJWTToken("touchid");
      });
    };
    self.getStoredToken = function() {
      var decryptConfig = {
        "disableBackup": true,
        "maxAttempts": 5,
        "message": self.nls.loginForm.labels.fingerPrintAuthMessage
      };
      var successCallback = function(result) {
        self.storedJWT = ko.observable(result);
        self.validateJWTToken("touchid");
      };
      var errorCallback = function(error) {
        $(".se-pre-con").fadeOut();
        if (error === "Fingerprint_Changed") {
          self.optForAlternateLogin(false);
          rootParams.baseModel.showMessages(null, [self.nls.loginForm.labels.fp_changed], "ERROR");
        } else {
          rootParams.baseModel.showMessages(null, [self.nls.loginForm.labels.fp_error], "ERROR");
        }
      };
      window.plugins.auth.touchid.verify(decryptConfig, successCallback, errorCallback);
    };
    self.OAM = {
      validateJWTToken: function() {
        $(".se-pre-con").show();
        var url = self.oam_url + "/oic_rest/rest/jwtoamauthentication/tokens/info?X-Idaas-Rest-Subject-Value=" + self.storedJWT() + "&X-Idaas-Rest-Subject-Type=TOKEN";
        window.cordovaFetch(url, {
          method: "GET",
          headers: {
            "User-Agent": "OIC-Authentication",
            "X-IDAAS-SERVICEDOMAIN": "Default"
          }
        }).then(function(response) {
          if (response.status === 200) {
            self.getUserTokenFromJWT();
          } else {
            self.deleteSecret(self.nls.loginForm.labels.fp_token_failed);
          }
        }).catch(function(ex) {
          $(".se-pre-con").fadeOut();
          BaseLogger.error("ERROR IN VALIDATE JWT TOKEN");
          rootParams.baseModel.showMessages(null, [ex.message], "ERROR");
        });
      }
    };
    self.NONOAM = {
      validateJWTToken: function() {
        $(".se-pre-con").show();
        $.ajax({
          url: self.server_url + Constants.appBaseURL + "/" + Constants.appDefaultVersion + "/session",
          method: "POST",
          success: function() {
            self.accessService({
              accessToken: self.storedJWT()
            }, true);
          },
          error: function() {
            self.deleteSecret(self.nls.loginForm.labels.fp_token_failed);
            $(".se-pre-con").fadeOut();
            BaseLogger.error("ERROR IN VALIDATE JWT TOKEN");
            rootParams.baseModel.showMessages(null, [self.nls.loginForm.labels.fp_token_failed], "ERROR");
          }
        });
      }
    };
    self.OAUTH = {
      validateJWTToken: function(authType, params) {
        $(".se-pre-con").show();
        var url = self.oauth_Provider_URL;
        window.plugins.appPreferences.fetch("APP_CLIENT_ID").then(function(clientID) {
          window.cordovaFetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-OAUTH-IDENTITY-DOMAIN-NAME": "OBDXMobileAppDomain",
              "Authorization": "Basic " + clientID
            },
            body: "grant_type=refresh_token&refresh_token=" + encodeURIComponent(self.storedJWT())
          }).then(function(response) {
            if (response.status === 404) {
              BaseLogger.error("ERROR IN GET USER TOKEN - NOT FOUND");
              rootParams.baseModel.showMessages(null, [response.statusText], "ERROR");
            }
            if (response.status === 200) {
              var jsonObject = JSON.parse(response.statusText);
              if (jsonObject && jsonObject.refresh_token && authType) {
                params = params ? params : {};
                params.password = jsonObject.refresh_token;
                window.plugins.auth[authType].update(params);
              }
              Model.session().then(function() {
                self.accessService({
                  accessToken: jsonObject.access_token,
                  domain: "OBDXMobileAppDomain"
                });
              }).catch(function(ex) {
                rootParams.baseModel.showMessages(null, [ex.message], "ERROR");
                BaseLogger.error("ERROR IN SESSION NONCE");
              });
            } else if (response.status === 401) {
              BaseLogger.error("ERROR IN GET USER TOKEN - UNAUTHORIZED");
              rootParams.baseModel.showMessages(self.nls.loginForm.validationMsgs.invalidCredentials);
            } else {
              rootParams.baseModel.showMessages(null, [self.nls.loginForm.labels.login_error], "ERROR");
            }
          }).catch(function(ex) {
            BaseLogger.error("ERROR IN GET USER TOKEN");
            rootParams.baseModel.showMessages(null, [ex.message], "ERROR");
          });
        });
      }
    };
    self.getUserTokenFromJWT = function() {
      var url = self.oam_url + "/oic_rest/rest/jwtoamauthentication/authenticate";
      window.cordovaFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "OIC-Authentication",
          "X-IDAAS-SERVICEDOMAIN": "Default"
        },
        body: JSON.stringify({
          "X-Idaas-Rest-Subject-Type": "TOKEN",
          "X-Idaas-Rest-Subject-Value": self.storedJWT(),
          "X-Idaas-Rest-New-Token-Type-To-Create": "USERTOKEN::OAMUT",
          "X-Idaas-Rest-Subject-Credential": window.device.uuid
        })
      }).then(function(response) {
        if (response.status === 200) {
          var jsonObject = JSON.parse(response.statusText);
          var userToken = jsonObject["X-Idaas-Rest-Token-Value"];
          self.oamUserToken = ko.observable(userToken);
          self.getAccessContext();
        } else {
          self.deleteSecret(self.nls.loginForm.labels.fp_token_invalid);
        }
      }).catch(function(ex) {
        $(".se-pre-con").fadeOut();
        BaseLogger.error("ERROR IN GET USER TOKEN FROM JWT");
        rootParams.baseModel.showMessages(null, [ex.message], "ERROR");
      });
    };
    self.getAccessContext = function() {
      var url = self.server_url + "/retail/pages/model-bank.html";
      window.cordovaFetch(url, {
        method: "GET",
        redirect: false
      }).then(function(response) {
        var jsonObject = JSON.parse(JSON.stringify(response.headers));
        var accessContextString = jsonObject.Location;
        if (typeof accessContextString !== "undefined" && accessContextString.length) {
          accessContextString = accessContextString.substr(accessContextString.indexOf("?") + 1);
        }
        self.contextId = ko.observable(accessContextString);
        self.getOAMAccessToken();
      }).catch(function(ex) {
        BaseLogger.error("ERROR IN GET ACCESS CONTEXT");
        $(".se-pre-con").fadeOut();
        rootParams.baseModel.showMessages(null, [ex.message], "ERROR");
      });
    };
    self.getOAMAccessToken = function() {
      var url = self.oam_url + "/oic_rest/rest/jwtoamauthentication/access";
      window.cordovaFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "OIC-Authentication",
          "X-IDAAS-SERVICEDOMAIN": "Default"
        },
        body: JSON.stringify({
          "X-Idaas-Rest-Subject-Type": "TOKEN",
          "X-Idaas-Rest-Subject-Value": self.oamUserToken(),
          "X-Idaas-Rest-New-Token-Type-To-Create": "ACCESSTOKEN",
          "X-Idaas-Rest-Application-Context": self.contextId(),
          "X-Idaas-Rest-Application-Resource": self.server_url + "/retail/pages/model-bank.html" + (rootParams.baseModel.cordovaDevice() === "IOS" ? "?" : "")
        })
      }).then(function(response) {
        if (response.status === 200) {
          var jsonObject = JSON.parse(response.statusText);
          var accessToken = jsonObject["X-Idaas-Rest-Token-Value"];
          self.accessService({
            accessToken: accessToken
          }, true);
        } else {
          $(".se-pre-con").fadeOut();
          if (status === "401") {
            BaseLogger.error("ERROR IN GET OAM ACCESS TOKEN - UNAUTHORIZED");
            self.message(self.nls.loginForm.validationMsgs.invalidCredentials);
          } else {
            rootParams.baseModel.showMessages(null, [self.nls.loginForm.labels.login_error], "ERROR");
          }
        }
      }).catch(function(ex) {
        $(".se-pre-con").fadeOut();
        BaseLogger.error("ERROR IN GET OAM ACCESS TOKEN");
        rootParams.baseModel.showMessages(null, [ex.message], "ERROR");
      });
    };
    self.deleteSecret = function(msg) {
      $(".se-pre-con").fadeOut();
      rootParams.baseModel.showMessages(null, [msg], "ERROR");
      window.plugins.auth.delete();
      window.plugins.appPreferences.remove(dummyFunction, dummyFunction, "alternate_preference");
      window.plugins.appPreferences.remove(dummyFunction, dummyFunction, "account_snapshot_status");
    };
    if (rootParams.type().indexOf("pin") === 0) {
      self.typeOfLogin("pin-login");
      self.dataForParams = {
        lengthOfPin: parseInt(rootParams.type().split("-")[1])
      };
    } else if (rootParams.type().indexOf("pattern") === 0) {
      self.typeOfLogin("pattern-login");
      self.dataForParams = {
        patternVisible: rootParams.type().split("-")[1] || null
      };
    } else if (rootParams.type() === "touchid") {
      self.getStoredToken();
       } else if (rootParams.type() === "faceid"){
       self.getStoredToken();
       }
  };
});
