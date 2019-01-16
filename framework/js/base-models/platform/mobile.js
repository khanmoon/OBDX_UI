define(["jquery", "baseLogger", "framework/js/constants/constants", "baseService"], function ($, BaseLogger, Constants, BaseService) {
  "use strict";
  var behaviour, serverURL, OAMURL, authorizationToken, serverType, chatbotId, chatbotUrl, webURL, OAUTHProviderURL, loginScope, offlineScope, xTokenType,
    protectedPage = "@@SECURE_PAGE";
  var OAM = function (showMessages) {
    var getAccessToken = function () {
      var self = this;
      var url = self.oam_url + "/oic_rest/rest/oamauthentication/access";
      window.cordovaFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "OIC-Authentication",
          "X-IDAAS-SERVICEDOMAIN": "Default"
        },
        body: JSON.stringify({
          "X-Idaas-Rest-Subject-Type": "TOKEN",
          "X-Idaas-Rest-Subject-Value": self.userToken,
          "X-Idaas-Rest-New-Token-Type-To-Create": "ACCESSTOKEN",
          "X-Idaas-Rest-Application-Context": self.accessContext,
          "X-Idaas-Rest-Application-Resource": self.server_url + protectedPage + (behaviour === "IOS" ? "?" : "")
        })
      }).then(function (response) {
        if (response.status === 200) {
          var jsonObject = JSON.parse(response.statusText);
          var accessToken = jsonObject["X-Idaas-Rest-Token-Value"];
          self.accessService({
            accessToken: accessToken
          });
        } else if (status === 401) {
          BaseLogger.error("ERROR IN GET ACCESS TOKEN - UNAUTHORIZED");
          showMessages(self.nls.loginForm.validationMsgs.invalidCredentials);
        } else if (status === 404) {
          BaseLogger.error("ERROR IN GET ACCESS TOKEN - NOT FOUND");
          showMessages(null, [response.status], "ERROR");
        } else {
          showMessages(null, [self.nls.loginForm.labels.login_error], "ERROR");
        }
      }).catch(function (ex) {
        BaseLogger.error("ERROR IN GET ACCESS TOKEN");
        showMessages(null, [ex.message], "ERROR");
      });
    };
    var getAccessContext = function () {
      var self = this;
      var url = self.server_url + protectedPage;
      window.cordovaFetch(url, {
        method: "GET",
        redirect: false
      }).then(function (response) {
        if (response.status === 404) {
          BaseLogger.error("ERROR IN GET ACCESS CONTEXT - NOT FOUND");
          showMessages(null, [response.statusText], "ERROR");
        }
        var jsonObject = JSON.parse(JSON.stringify(response.headers));
        var accessContextString = jsonObject.Location;
        if (typeof (accessContextString) !== "undefined" && accessContextString.length) {
          self.accessContext = accessContextString.substr(accessContextString.indexOf("?") + 1);
          getAccessToken.call(self);
        }
      }).catch(function (ex) {
        BaseLogger.error("ERROR IN GET ACCESS CONTEXT");
        showMessages(null, [ex.message], "ERROR");
      });
    };
    var getUserToken = function () {
      var self = this;
      var url = self.oam_url + "/oic_rest/rest/oamauthentication/authenticate";
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
          "X-Idaas-Rest-New-Token-Type-To-Create": "USERTOKEN"
        })
      }).then(function (response) {
        if (response.status === 404) {
          BaseLogger.error("ERROR IN GET USER TOKEN - NOT FOUND");
          showMessages(null, [response.statusText], "ERROR");
        }
        if (response.status === 200) {
          var jsonObject = JSON.parse(response.statusText);
          self.userToken = jsonObject["X-Idaas-Rest-Token-Value"];
          getAccessContext.call(self);
        } else if (response.status === 401) {
          BaseLogger.error("ERROR IN GET USER TOKEN - UNAUTHORIZED");
          showMessages(self.nls.loginForm.validationMsgs.invalidCredentials);
        } else {
          showMessages(null, [self.nls.loginForm.labels.login_error], "ERROR");
        }
      }).catch(function (ex) {
        BaseLogger.error("ERROR IN GET USER TOKEN");
        showMessages(null, [ex.message], "ERROR");
      });
    };
    var accessServicePreHook = function (accessToken) {
      accessToken = "OAM-Auth " + accessToken;
      authorizationToken = accessToken;
    };
    return {
      getUserToken: getUserToken,
      accessServicePreHook: accessServicePreHook
    };
  };
  var NONOAM = function () {
    var getUserToken = function () {
      var self = this;
      var url = self.server_url + Constants.appBaseURL + "/j_security_check";
      var xhr = new XMLHttpRequest();
      var options = {};
      options.url = url;
      options.type = "POST";
      options.contentType = "application/x-www-form-urlencoded";
      options.showMessage = true;
      options.xhrFields = {
        "withCredentials": true
      };
      xhr.open(options.type, options.url, true);
      xhr.setRequestHeader("Content-type", options.contentType);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 404) {
            self.accessService();
          } else if (xhr.status === 403) {
            var redirectURL = xhr.getResponseHeader("X-AUTH-LOCATION-URL");
            redirectURL = window.location.origin + window.location.pathname + redirectURL.slice(redirectURL.indexOf("?"));
            window.location = redirectURL;
          }
        }
      };
      xhr.send("j_username=" + self.username() + "&j_password=" + self.password());
    };
    var accessServicePreHook = function (header) {
      if (header) {
        return {
          "Authorization": "Bearer " + header.accessToken,
          "X-Token-Type": "JWT"
        };
      }
    };
    return {
      getUserToken: getUserToken,
      accessServicePreHook: accessServicePreHook
    };
  };

  var OAUTH = function (showMessages) {
    var getUserToken = function () {
      var self = this;
      var url = self.oauth_Provider_URL;
      var baseService = BaseService.getInstance();
      window.plugins.appPreferences.fetch("APP_CLIENT_ID").then(function (clientID) {
        window.cordovaFetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + clientID,
            "X-OAUTH-IDENTITY-DOMAIN-NAME": "OBDXMobileAppDomain"
          },
          body: "grant_type=password&username=" + self.username() + "&password=" + encodeURIComponent(self.password()) + "&scope=" + self.login_scope
        }).then(function (response) {
          if (response.status === 404) {
            BaseLogger.error("ERROR IN GET USER TOKEN - NOT FOUND");
            showMessages(null, [response.statusText], "ERROR");
          }
          if (response.status === 200) {
            var jsonObject = JSON.parse(response.statusText);
            baseService.add({
              url: "session",
              method: "POST",
              data: ""
            }).then(function () {
              self.accessService({
                accessToken: jsonObject.access_token,
                domain: "OBDXMobileAppDomain"
              });
            }).catch(function (ex) {
              showMessages(null, [ex.message], "ERROR");
              BaseLogger.error("ERROR IN SESSION NONCE");
            });
          } else if (response.status === 401) {
            BaseLogger.error("ERROR IN GET USER TOKEN - UNAUTHORIZED");
            showMessages(self.nls.loginForm.validationMsgs.invalidCredentials);
          } else {
            showMessages(null, [self.nls.loginForm.labels.login_error], "ERROR");
          }
        }).catch(function (ex) {
          BaseLogger.error("ERROR IN GET USER TOKEN");
          showMessages(null, [ex.message], "ERROR");
        });
      });
    };
    var accessServicePreHook = function (headers) {
      if (headers) {
        return {
          "Authorization": "Bearer " + headers.accessToken,
          "X-OAUTH-IDENTITY-DOMAIN-NAME": headers.domain,
          "X-Token-Type": xTokenType
        };
      }
    };
    return {
      getUserToken: getUserToken,
      accessServicePreHook: accessServicePreHook
    };
  };

  var mobileExports = {
    init: function (platform, resolve) {
      require(["cordova"], function () {
        function onDeviceReady() {
          behaviour = window.device.platform.toUpperCase();
          var prefPromise = function (key) {
            return new Promise(function (resolve, reject) {
              var success = function (val) {
                resolve(val);
              };
              var error = function () {
                reject();
              };
              window.plugins.appPreferences.fetch(success, error, key);
            });
          };

          Promise.all([prefPromise("KEY_SERVER_URL"), prefPromise("SERVER_TYPE"), prefPromise("CHATBOT_ID"), prefPromise("CHATBOT_URL")]).then(function (values) {
            serverURL = values[0];
            serverType = values[1];
            chatbotId = values[2];
            chatbotUrl = values[3];
            if (mobileExports.getServerType() === "OAM") {
              prefPromise("KEY_OAM_URL").then(function (value) {
                OAMURL = value;
                resolve(platform);
              }, function () {
                BaseLogger.error("Preference values are not loaded");
              });
            } else if (mobileExports.getServerType() === "NONOAM") {
              resolve(platform);
            } else if (mobileExports.getServerType() === "OAUTH") {
              Promise.all([prefPromise("KEY_OAM_URL"), prefPromise("WEB_URL"), prefPromise("KEY_OAUTH_PROVIDER_URL"), prefPromise("LOGIN_SCOPE"), prefPromise("OFFLINE_SCOPE"), prefPromise("X_TOKEN_TYPE")]).then(function (values) {
                OAMURL = values[0];
                webURL = values[1];
                OAUTHProviderURL = values[2];
                loginScope = values[3];
                offlineScope = values[4];
                xTokenType = values[5];
                resolve(platform);
              }, function () {
                BaseLogger.error("Preference values are not loaded");
              });
            } else {
              BaseLogger.error("NO Valid Authentication Type Found");
            }
          }, function () {
            BaseLogger.error("Preference values are not loaded");
          });

          navigator.globalization.getPreferredLanguage(
            function (language) {
              require.config.locale = language;
            },
            function () {
              BaseLogger.error("Error getting language\n");
            }
          );
        }
        document.addEventListener("deviceready", onDeviceReady, false);
      });
    },
    downloadFile: function (options, nonce) {
      var headers;
      headers = {
        "x-nonce": nonce,
        "Authorization": authorizationToken,
        "User-Agent": "OIC-Authentication"
      };
      var fileTransfer = new window.FileTransfer();
      var uri = encodeURI(options.url);
      var fileURL = null;
      if (behaviour === "ANDROID") {
        fileURL = window.cordova.file.externalDataDirectory;
      } else if (behaviour === "IOS") {
        fileURL = window.cordova.file.documentsDirectory;
      }
      fileTransfer.download(uri, fileURL, function (entry) {
        window.cordova.plugins.fileOpener2.open(entry.nativeURL, entry.mimeType, {
          error: function () {
            $(".se-pre-con").fadeOut();
          },
          success: function () {
            $(".se-pre-con").fadeOut();
          }
        });
      }, null, false, {
        headers: headers
      });
    },
    addHeader: function (headers) {
      if (authorizationToken) {
        headers.Authorization = authorizationToken;
      }
      headers.deviceKey = window.device.uuid;
    },
    showSecuritySettings: function (userName, flag) {
      if (behaviour === "ANDROID") {
        window.PinPatternAuth.decryptOwner().then(function (name) {
          if (name === userName)
            flag(true);
        });
      } else if (behaviour === "IOS") {
        window.plugins.auth.owner.get().then(function (name) {
          if (name === userName)
            flag(true);
        });
      }
    },
    registerDevice: function () {
      return new Promise(function (resolve, reject) {
        var baseService = BaseService.getInstance();
        var payload = {};
        if (behaviour === "ANDROID") {
          payload.osVersion = window.device.version;
          payload.os = window.device.platform.toUpperCase();
          payload.manufacturer = window.device.manufacturer;
          payload.model = window.device.model;
          payload.secureDeviceId = window.device.uuid;
          payload = JSON.stringify(payload);
          baseService.add({
            url: "mobileClient",
            data: payload
          }).then(function () {
            resolve();
          });
        } else if (behaviour === "IOS") {
          window.DeviceCompliance.getDeviceInfo(function (info) {
            payload = JSON.stringify(info);
            baseService.add({
              url: "mobileClient",
              data: payload
            }).then(function () {
              resolve();
            });
          }, function () {
            reject();
          });
        }
      });
    },
    getServerURL: function (getWebUrl) {
      if (getWebUrl && mobileExports.getServerType() === "OAUTH") {
        return webURL;
      }
      return serverURL;
    },
    getOAMURL: function () {
      return OAMURL;
    },
    getOAUTHProviderURL: function () {
      return OAUTHProviderURL;
    },
    getLoginScope: function () {
      return loginScope;
    },
    getOfflineScope: function () {
      return offlineScope;
    },
    getXTokenType: function () {
      return xTokenType;
    },
    getServerType: function () {
      return serverType;
    },
    getChatbotConfig: function () {
      return {
        chatbot_id: chatbotId,
        chatbot_url: chatbotUrl
      };
    },
    setAuthToken: function (token) {
      authorizationToken = token;
    },
    logOut: function () {
      if (mobileExports.getServerType() === "OAM") {
        $.ajax({
          url: OAMURL + "/oam/server/logout",
          headers: {
            "Authorization": authorizationToken
          },
          success: function () {
            window.location = "index.html?module=login&context=index";
          }
        });
      } else if (mobileExports.getServerType() === "NONOAM" || mobileExports.getServerType() === "OAUTH") {
        window.location = "index.html?module=login&context=index";
      }
    },
    login: function (showMessages) {
      if (mobileExports.getServerType() === "OAM") {
        return OAM(showMessages);
      } else if (mobileExports.getServerType() === "NONOAM") {
        return NONOAM(showMessages);
      } else if (mobileExports.getServerType() === "OAUTH") {
        return OAUTH(showMessages);
      }
    },
    postLogin: function () {
      var baseService = BaseService.getInstance();
      var pushRegistration = function (payload) {
        var options = {
          url: "mobileClient/pushRegistration",
          data: payload
        };
        return baseService.add(options);
      };
      var getPayeeList = function () {
        var url = "payments/payeeGroup?expand=ALL&types=INTERNAL,INTERNATIONAL,INDIADOMESTIC,UKDOMESTIC,SEPADOMESTIC";
        var options = {
          url: url
        };
        return baseService.fetch(options);
      };
      var registerForPush = function (token) {
        var payload = {};
        if (behaviour === "IOS") {
          window.DeviceCompliance.getDeviceInfo(function (info) {
            info.registrationToken = token || "";
            info.pushAllowed = !!token;
            payload = JSON.stringify(info);
            pushRegistration(payload).then(function () {
              window.plugins.appPreferences.store("push_status", "REGISTERED");
            });
          });
        } else {
          payload.osVersion = window.device.version;
          payload.os = window.device.platform.toUpperCase();
          payload.manufacturer = window.device.manufacturer;
          payload.model = window.device.model;
          payload.secureDeviceId = window.device.uuid;
          payload.registrationToken = token || "";
          payload.pushAllowed = !!token;
          payload = JSON.stringify(payload);
          pushRegistration(payload).then(function () {
            window.plugins.appPreferences.store("push_status", "REGISTERED");
          });
        }
      };
      var getTheToken = function () {
        window.FCMPlugin.getToken(function (token) {
          if (token) {
            window.plugins.appPreferences.store("registration_token", token);
          } else {
            setTimeout(getTheToken, 1000);
          }
        });
      };
      window.plugins.appPreferences.fetch("push_status").then(function (status) {
        if (status === "ALLOWED") {
          window.plugins.appPreferences.fetch("registration_token").then(function (token) {
            if (token) {
              registerForPush(token);
            } else if (behaviour === "ANDROID") {
              setTimeout(getTheToken, 1000);
            }
          });
        } else if (status === "DISALLOWED") {
          registerForPush();
        }
      });
      if (behaviour === "IOS") {
        getPayeeList().then(function (data) {
          var payeeArray = [];
          for (var i = 0; i < data.payeeGroups.length; i++) {
            for (var j = 0; j < data.payeeGroups[i].listPayees.length; j++) {
              payeeArray.push(data.payeeGroups[i].listPayees[j].nickName);
            }
          }
          window.plugins.auth.siri.savePayees(data, payeeArray);
        });
      }
    }
  };
  return mobileExports;
});
