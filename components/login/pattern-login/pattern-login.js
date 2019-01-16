define([
  "knockout",
  "jquery",

  "ojL10n!resources/nls/pattern-login",
  "baseLogger",
  "json!local!./pin-pattern-max-attempts",
  "platform"
], function(ko, $, resourceBundle, BaseLogger, MaxAttempts, Platform) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.error = ko.observable("");
    self.containerId = "patternContainerLogin" + rootParams.baseModel.incrementIdCount();
    var pattern;
    var lockSet;
    var errorAppPreference = function() {
      BaseLogger.error("error in getting or setting app preference");
    };
    var subtractNoOfAttempts = function() {
      window.plugins.appPreferences.fetch(function(value) {
        if (parseInt(value) > 0) {
          window.plugins.appPreferences.store(function() {
            self.getStoredTokenAndLogin();
          }, errorAppPreference, "max_attempts", parseInt(value) - 1);
        } else {
          self.closeDialog();
          self.deleteSecret(self.resource.maximumRetrysExceeded);
        }
      }, errorAppPreference, "max_attempts");
    };

    function patternEntered(value) {
      pattern = value;
      self.error(self.resource.loading);
      subtractNoOfAttempts();
    }
    require(["thirdPartyLibs/patternLock/patternLock"], function(PatternLock) {
      lockSet = new PatternLock("#" + self.containerId, {
        radius: 20,
        onDraw: patternEntered,
        patternVisible: !!(rootParams.data && rootParams.data.patternVisible === "visible")
      });
    });
    self.closeDialog = function() {
      $("#patternLogin").hide();
    };
    self.getStoredTokenAndLogin = function() {
      function successCallback(result) {
        self.storedJWT(result);
        window.plugins.appPreferences.store(function() {
          Platform.getInstance().then(function(platform) {
            var serverType = self[platform("getServerType")];
            serverType.validateJWTToken("pattern", {
              pin: pattern
            });
          });
        }, errorAppPreference, "max_attempts", MaxAttempts.maxAttempts);
        setTimeout(function() {
          lockSet.reset();
        }, 500);
      }

      function errorCallback() {
        window.plugins.appPreferences.fetch(function(maxAttempts) {
          if (parseInt(maxAttempts) < 1) {
            self.closeDialog();
            self.deleteSecret(self.resource.maximumRetrysExceeded);
          }
          lockSet.error();
          setTimeout(function() {
            lockSet.reset();
          }, 500);
          self.error(self.resource.invalidPattern);
        }, errorAppPreference, "max_attempts");
      }
      window.plugins.auth.pattern.verify({
        pin: pattern
      }, successCallback, errorCallback);
    };
  };
});
